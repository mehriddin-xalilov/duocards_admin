import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { faqApi, FaqItemType } from "@/services/api/faq.api";
import { ValidationField } from "@/components/Form/types";

type FaqModalProps = {
    setFaqModal: ({
        open,
        faq,
        lang_hash,
    }: {
        open: boolean;
        faq?: FaqItemType;
        lang_hash?: string;
    }) => void;
    faqDataModal: { open: boolean; faq?: FaqItemType; lang_hash?: string };
};

export const FaqModal = (props: FaqModalProps) => {
    const {
        faqDataModal: { open, faq, lang_hash },
        setFaqModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/faqs" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(faq?.translations || []), { id: faq?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setFaqModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchFaq = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await faqApi.getFaq<FaqItemType>(activeLang.id);

            if (res.data) {
                setFaqModal({ open: true, faq: res.data, lang_hash: lang_hash });
            }
        } else {
            setFaqModal({
                open: true,
                lang_hash: lang_hash,
                faq: {
                    created_at: "",
                    sort: NaN,
                    description: "",
                    id: 0,
                    lang: "",
                    updated_at: "",
                    lang_hash: "",
                    status: 0,
                    question: "",
                    answer: "",
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["faqs"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Savol muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchFaq();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "question",
                validationType: "string",
                isRequired: true,
                defaultValue: faq?.question ?? "",
                errorMessage: "Iltimos savolni kiriting",
            },
            {
                name: "answer",
                validationType: "string",
                isRequired: true,
                defaultValue: faq?.answer ?? "",
                errorMessage: "Iltimos javobni kiriting",
            },

            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(faq?.sort) ?? "",
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
                defaultValue: Boolean(faq?.status),
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
    }, [faq, lang, lang_hash]);

    return (
        <Modal
            header={faq ? "Savolni o'zgartirish" : "Savolni yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={faq?.id}
                fetchFunction={
                    faq?.id ? (values) => faqApi.updateFaq(faq.id, values) : faqApi.createFaq
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Textarea
                                label="Savol"
                                name="question"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <FormFields.Textarea
                                label="Javob"
                                name="answer"
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
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {faq?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
