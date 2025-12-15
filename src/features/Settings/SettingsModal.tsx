import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
// import { UploadResponse } from "@/services/api/file.api";
import { UploadResponse } from "@/services/api/file.api";
import { SettingsApi, SettingItemType } from "@/services/api/settings.api";

type SettingsModalProps = {
    setSettingsModal: ({
        open,
        settings,
        lang_hash,
    }: {
        open: boolean;
        settings?: SettingItemType;
        lang_hash?: string;
    }) => void;
    settingsModalData: { open: boolean; settings?: SettingItemType; lang_hash?: string };
};

export const SettingsModal = (props: SettingsModalProps) => {
    const {
        settingsModalData: { open, settings, lang_hash },
        setSettingsModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/settings" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(settings?.translations || []), { id: settings?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setSettingsModal({ open: false });
        setLang(search.lang);
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    const fetchSetting = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await SettingsApi.getSetting<SettingItemType>(activeLang.id);

            if (res.data) {
                setSettingsModal({ open: true, settings: res.data, lang_hash: lang_hash });
            }
        } else {
            setSettingsModal({
                open: true,
                lang_hash: lang_hash,
                settings: {
                    photo: settings?.photo ?? null,
                    name: "",
                    btn_text: "",
                    link: "",
                    alias: "",
                    lang: "",
                    lang_hash: "",
                    sort: 0,
                    id: 0,
                    status: false,
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["settings"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Sozlama muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        if (open) {
            fetchSetting();
        }
    }, [lang]);

    return (
        <Modal
            header={settings ? "Sozlamani o'zgartirish" : "Solzlamani yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={settings?.id}
                fetchFunction={
                    settings?.id
                        ? (values) => SettingsApi.updateSetting(settings.id, values)
                        : SettingsApi.createSetting
                }
                fields={[
                    {
                        name: "name",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: settings?.name ?? "",
                        errorMessage: "Iltimos sozlama nomini kiriting",
                    },
                    {
                        name: "btn_text",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: settings?.btn_text ?? "",
                        errorMessage: "Iltimos sozlamaning tugma nomini kiriting",
                    },
                    {
                        name: "link",
                        validationType: "string",
                        defaultValue: settings?.link ?? "",
                        errorMessage: "Iltimos sozlama linkini kiriting",
                    },
                    {
                        name: "alias",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: settings?.alias ?? "",
                        errorMessage: "Iltimos sozlama aliasini kiriting",
                    },

                    {
                        name: "lang",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: lang,
                    },
                    {
                        name: "sort",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: String(settings?.sort) ?? "",
                        errorMessage: "Iltimos tartib raqamini kiriting",
                        onSubmit: (value) => Number(value),
                    },
                    {
                        name: "photo",
                        validationType: "any",
                        isRequired: false,
                        defaultValue: settings?.photo?.id ?? "",
                        errorMessage: "Iltimos rasm  yuklang",
                    },
                    {
                        name: "lang_hash",
                        validationType: "string",
                        isRequired: lang_hash ? true : false,
                        defaultValue: lang_hash ? lang_hash : "",
                    },
                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: Boolean(settings?.status),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Textarea
                                label="Sarlavha"
                                name="name"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Tugma nomi"
                                name="btn_text"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Link"
                                name="link"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Alias"
                                name="alias"
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Tartib raqami"
                                name="sort"
                                radius="sm"
                                type="number"
                                {...formRestProps}
                            />
                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={
                                    settings?.photo ? [settings.photo as UploadResponse] : []
                                }
                                label="Rasm yuklash"
                                multiple={false}
                                name="photo"
                                {...formRestProps}
                            />

                            <FormFields.Switch label="Status" name="status" {...formRestProps} />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {settings?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
