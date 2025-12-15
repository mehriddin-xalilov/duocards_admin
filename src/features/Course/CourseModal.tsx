import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { courseApi, CourseItemType } from "@/services/api/course.api";
import { TypesApi } from "@/services/api/types.api";
import { ValidationField } from "@/components/Form/types";

type CourseModalProps = {
    setCourseModal: ({
        open,
        course,
        lang_hash,
    }: {
        open: boolean;
        course?: CourseItemType;
        lang_hash?: string;
    }) => void;
    courseDataModal: { open: boolean; course?: CourseItemType; lang_hash?: string };
};

export const CourseModal = (props: CourseModalProps) => {
    const {
        courseDataModal: { open, course, lang_hash },
        setCourseModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/course" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(course?.translations || []), { id: course?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setCourseModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchCourse = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await courseApi.getCourse<CourseItemType>(activeLang.id);

            if (res.data) {
                setCourseModal({ open: true, course: res.data, lang_hash: lang_hash });
            }
        } else {
            setCourseModal({
                open: true,
                lang_hash: lang_hash,
                course: {
                    icon: course?.icon ?? null,
                    created_at: "",
                    description: "",
                    id: 0,
                    lang: "",
                    updated_at: "",
                    lang_hash: "",
                    status: 0,
                    link: "",
                    name: "",
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Kurs muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchCourse();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "name",
                validationType: "string",
                isRequired: true,
                defaultValue: course?.name ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "link",
                validationType: "string",
                isRequired: true,
                defaultValue: course?.link ?? "",
                errorMessage: "Iltimos link kiriting",
            },
            {
                name: "description",
                validationType: "string",

                defaultValue: course?.description ?? "",
                errorMessage: "Iltimos tavsifni kiriting",
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
                defaultValue: Boolean(course?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "icon",
                validationType: "number",
                isRequired: true,
                defaultValue: course?.icon?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
            {
                name: "type_id",
                validationType: "string",
                isRequired: true,
                defaultValue: String(course?.type_id) ?? "",
                errorMessage: "Iltimos turni tanlang",
                onSubmit: (value) => value && Number(value),
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
    }, [course, lang, lang_hash]);

    console.log([course?.type_id]);
    return (
        <Modal
            header={course ? "Kursni o'zgartirish" : "Kursni yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={course?.id}
                fetchFunction={
                    course?.id
                        ? (values) => courseApi.updateCourse(course.id, values)
                        : courseApi.createCourse
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Textarea
                                label="Sarlavha"
                                name="name"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <FormFields.AsyncSelect
                                fetchFunction={TypesApi.getTypes}
                                label="Tur"
                                name="type_id"
                                defaultSelectedKeys={[String(course?.type_id)]}
                                optionLabel={(item) => item.name[lang] ?? item.name.uz}
                                optionValue="id"
                                params={{ _l: lang, per_page: 1000 }}
                                selectionMode="single"
                                setValue={setValue}
                                {...formRestProps}
                            />

                            <FormFields.Input
                                label="Link"
                                name="link"
                                setValue={setValue}
                                radius="sm"
                                type="text"
                                {...formRestProps}
                            />

                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={course?.icon ? [course.icon as UploadResponse] : []}
                                label="Icon yuklash"
                                multiple={false}
                                setValue={setValue}
                                isOnly={["img"]}
                                name="icon"
                                {...formRestProps}
                            />
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {course?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
