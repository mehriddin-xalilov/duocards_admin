import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { teacherApi, TeacherItemType } from "@/services/api/teacher.api";
import { ValidationField } from "@/components/Form/types";

type TeacherModalProps = {
    setTeacherModal: ({
        open,
        teacher,
        lang_hash,
    }: {
        open: boolean;
        teacher?: TeacherItemType;
        lang_hash?: string;
    }) => void;
    teacherDataModal: { open: boolean; teacher?: TeacherItemType; lang_hash?: string };
};

export const TeacherModal = (props: TeacherModalProps) => {
    const {
        teacherDataModal: { open, teacher, lang_hash },
        setTeacherModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/teachers" });
    const [lang, setLang] = useState(search.lang ?? "oz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(teacher?.translations || []), { id: teacher?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setTeacherModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchTeacher = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await teacherApi.getTeacher<TeacherItemType>(activeLang.id);

            if (res.data) {
                setTeacherModal({ open: true, teacher: res.data, lang_hash: lang_hash });
            }
        } else {
            setTeacherModal({
                open: true,
                lang_hash: lang_hash,
                teacher: {
                    photo: teacher?.photo ?? null,
                    video: teacher?.video ?? null,
                    status: 0,
                    created_at: "",
                    description: "",
                    id: 0,
                    lang: "",
                    updated_at: "",
                    sort: "",
                    lang_hash: "",
                    position: "",
                    full_name: "",
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Ustoz muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchTeacher();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "full_name",
                validationType: "string",
                isRequired: true,
                defaultValue: teacher?.full_name ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "position",
                validationType: "string",
                isRequired: true,
                defaultValue: teacher?.position ?? "",
                errorMessage: "Iltimos pozitsiyani kiriting",
            },
            {
                name: "description",
                validationType: "string",

                defaultValue: teacher?.description ?? "",
                errorMessage: "Iltimos tavsifni kiriting",
            },
            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(teacher?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },

            {
                name: "lang",
                validationType: "string",
                isRequired: true,
                defaultValue: lang,
            },
            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(teacher?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "photo",
                validationType: "number",
                isRequired: true,
                defaultValue: teacher?.photo?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
            {
                name: "video",
                validationType: "number",
                isRequired: true,
                defaultValue: teacher?.video?.id ?? "",
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
    }, [teacher, lang, lang_hash]);

    return (
        <Modal
            header={teacher ? "Ustozni o'zgartirish" : "Ustoz yaratish"}
            isOpen={open}
            size="xl"
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={teacher?.id}
                fetchFunction={
                    teacher?.id
                        ? (values) => teacherApi.updateTeacher(teacher.id, values)
                        : teacherApi.createTeacher
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="To'liq ism"
                                name="full_name"
                                setValue={setValue}
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="position"
                                name="position"
                                setValue={setValue}
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />

                            <FormFields.Textarea
                                label="Tavsif"
                                name="description"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Tartib raqami"
                                name="sort"
                                radius="sm"
                                setValue={setValue}
                                type="number"
                                {...formRestProps}
                            />
                            <div className="flex w-full justify-between gap-3 h-[236px]">
                                <FormFields.FileUpload
                                    accept="image/*"
                                    defaultFiles={
                                        teacher?.photo ? [teacher.photo as UploadResponse] : []
                                    }
                                    label="Cover yuklash"
                                    multiple={false}
                                    setValue={setValue}
                                    isOnly={["img"]}
                                    isFull={true}
                                    name="photo"
                                    {...formRestProps}
                                />
                                <FormFields.FileUpload
                                    accept="image/*"
                                    defaultFiles={
                                        teacher?.video ? [teacher.video as UploadResponse] : []
                                    }
                                    label="Video yuklash"
                                    isFull={true}
                                    multiple={false}
                                    setValue={setValue}
                                    isOnly={["video"]}
                                    name="video"
                                    {...formRestProps}
                                />
                            </div>
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {teacher?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
