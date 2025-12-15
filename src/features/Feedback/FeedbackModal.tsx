import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { FeedbackApi, FeedbackItemType } from "@/services/api/feedback.api";
import { ValidationField } from "@/components/Form/types";

type FeedBackModalProps = {
    setFeedbackModal: ({
        open,
        feedback,
        lang_hash,
    }: {
        open: boolean;
        feedback?: FeedbackItemType;
        lang_hash?: string;
    }) => void;
    feedbackDataModal: { open: boolean; feedback?: FeedbackItemType; lang_hash?: string };
};

export const FeedbackModal = (props: FeedBackModalProps) => {
    const {
        feedbackDataModal: { open, feedback, lang_hash },
        setFeedbackModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/feedbacks" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(feedback?.translations || []), { id: feedback?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setFeedbackModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchFeedback = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await FeedbackApi.getFeedback<FeedbackItemType>(activeLang.id);

            if (res.data) {
                setFeedbackModal({ open: true, feedback: res.data, lang_hash: lang_hash });
            }
        } else {
            setFeedbackModal({
                open: true,
                lang_hash: lang_hash,
                feedback: {
                    video: feedback?.video ?? null,
                    created_at: "",
                    description: "",
                    id: 0,
                    sort: "",
                    lang: "",
                    updated_at: "",
                    status: 0,
                    lang_hash: "",
                    position: "",
                    full_name: "",
                    type: 1,
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Sharh muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchFeedback();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "full_name",
                validationType: "string",
                isRequired: true,
                defaultValue: feedback?.full_name ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "position",
                validationType: "string",
                isRequired: true,
                defaultValue: feedback?.position ?? "",
                errorMessage: "Iltimos pozitsiyani kiriting",
            },
            {
                name: "description",
                validationType: "string",

                defaultValue: feedback?.description ?? "",
                errorMessage: "Iltimos tavsifni kiriting",
            },
            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(feedback?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },

            {
                name: "lang",
                validationType: "string",
                isRequired: true,
                defaultValue: lang,
            },

            {
                name: "video",
                validationType: "any",
                isRequired: false,
                defaultValue: feedback?.video?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(feedback?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },
            {
                name: "type",
                validationType: "boolean",
                defaultValue: Boolean(feedback?.type),
                onSubmit: (value) => (value ? 1 : 0),
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
    }, [feedback, lang, lang_hash]);

    return (
        <Modal
            header={feedback ? "Sharhni o'zgartirish" : "Sharh yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={feedback?.id}
                fetchFunction={
                    feedback?.id
                        ? (values) => FeedbackApi.updateFeedback(feedback.id, values)
                        : FeedbackApi.createFeedback
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const type = formRestProps.watch("type");
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
                            {type && (
                                <FormFields.FileUpload
                                    accept="image/*"
                                    defaultFiles={
                                        feedback?.video ? [feedback.video as UploadResponse] : []
                                    }
                                    isFull={true}
                                    multiple={false}
                                    setValue={setValue}
                                    isOnly={["video"]}
                                    name="video"
                                    {...formRestProps}
                                />
                            )}

                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <FormFields.Switch
                                label="Video"
                                name="type"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {feedback?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
