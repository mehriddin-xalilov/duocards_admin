import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { aboutApi, AboutItemType } from "@/services/api/about.api";
import { ValidationField } from "@/components/Form/types";

type AboutModalProps = {
    setAboutModal: ({
        open,
        about,
        lang_hash,
    }: {
        open: boolean;
        about?: AboutItemType;
        lang_hash?: string;
    }) => void;
    aboutModal: { open: boolean; about?: AboutItemType; lang_hash?: string };
};

export const AboutModal = (props: AboutModalProps) => {
    const {
        aboutModal: { open, about, lang_hash },
        setAboutModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/about" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(about?.translations || []), { id: about?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setAboutModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchAbout = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await aboutApi.getAbout<AboutItemType>(activeLang.id);

            if (res.data) {
                setAboutModal({ open: true, about: res.data, lang_hash: lang_hash });
            }
        } else {
            setAboutModal({
                open: true,
                lang_hash: lang_hash,
                about: {
                    photo: about?.photo ?? null,
                    created_at: "",
                    description: "",
                    id: 0,
                    lang: "",
                    updated_at: "",
                    lang_hash: "",
                    title: "",
                    translations: [],
                    founded_at: "",
                    lessons_count: "",
                    all_listeners_count: "",
                    finished_listeners_count: "",
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["abouts"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchAbout();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "title",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.title ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "description",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.description ?? "",
                errorMessage: "Iltimos tavsifni kiriting",
            },
            {
                name: "founded_at",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.founded_at ? String(about?.founded_at) : "",
                errorMessage: "Iltimos asos solingan yilni kiriting",
            },
            {
                name: "lessons_count",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.lessons_count ? String(about?.lessons_count) : "",
                errorMessage: "Iltimos darslar sonini kiriting",
            },
            {
                name: "all_listeners_count",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.all_listeners_count ? String(about?.all_listeners_count) : "",
                errorMessage: "Iltimos talabalar sonini kiriting",
            },
            {
                name: "finished_listeners_count",
                validationType: "string",
                isRequired: true,
                defaultValue: about?.finished_listeners_count
                    ? String(about?.finished_listeners_count)
                    : "",
                errorMessage: "Iltimos bitirgan talabalar sonini kiriting",
            },
            {
                name: "lang",
                validationType: "string",
                isRequired: true,
                defaultValue: lang,
            },
            {
                name: "photo",
                validationType: "number",
                isRequired: true,
                defaultValue: about?.photo?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
        ];

        if (lang_hash) {
            baseFields.push({
                name: "lang_hash",
                validationType: "string",
                isRequired: true,
                defaultValue: lang_hash,
            });
        }

        return baseFields;
    }, [about, lang, lang_hash]);

    return (
        <Modal
            header={about ? "O'quv markaz haqida (O'zgartirish)" : "O'quv markaz haqida (Yaratish)"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={about?.id}
                fetchFunction={
                    about?.id
                        ? (values) => aboutApi.updateAbout(about.id, values)
                        : aboutApi.createAbout
                }
                fields={fields}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Sarlavha"
                                name="title"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Textarea
                                label="Tavsif"
                                name="description"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <FormFields.Input
                                    label="Asos solingan yil"
                                    name="founded_at"
                                    radius="sm"
                                    type="number"
                                    {...formRestProps}
                                />

                                <FormFields.Input
                                    label="Darslar soni"
                                    name="lessons_count"
                                    radius="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormFields.Input
                                    label="Talabalar soni"
                                    name="all_listeners_count"
                                    radius="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Bitirgan talabalar soni"
                                    name="finished_listeners_count"
                                    radius="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                            </div>
                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={about?.photo ? [about.photo as UploadResponse] : []}
                                label="Rasm yuklash"
                                multiple={false}
                                name="photo"
                                isOnly={["img"]}
                                {...formRestProps}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {about?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
