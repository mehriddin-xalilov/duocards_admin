import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { leadershipApi, LeaderShipItemType } from "@/services/api/leadership.api";
import { ValidationField } from "@/components/Form/types";
import { ResumeFields } from "./ResumeFields";

type LeadershipModalProps = {
    setLeadershiModal: ({
        open,
        leadership,
        lang_hash,
    }: {
        open: boolean;
        leadership?: LeaderShipItemType;
        lang_hash?: string;
    }) => void;
    leadershipDataModal: { open: boolean; leadership?: LeaderShipItemType; lang_hash?: string };
};

export const LeadershipModal = (props: LeadershipModalProps) => {
    const {
        leadershipDataModal: { open, leadership, lang_hash },
        setLeadershiModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/leadership" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(leadership?.translations || []), { id: leadership?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setLeadershiModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchLeadership = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await leadershipApi.getLeaderShip<LeaderShipItemType>(activeLang.id);

            if (res.data) {
                setLeadershiModal({ open: true, leadership: res.data, lang_hash: lang_hash });
            }
        } else {
            setLeadershiModal({
                open: true,
                lang_hash: lang_hash,
                leadership: {
                    photo: leadership?.photo ?? null,
                    created_at: "",
                    full_name: "",
                    position: "",
                    resume: [
                        {
                            title: "",
                            description: "",
                        },
                    ],
                    id: 0,
                    sort: NaN,
                    lang: "",
                    updated_at: "",
                    lang_hash: "",
                    status: 0,
                    email: "",
                    phone: "",
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["leadership"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Rahbariyat muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchLeadership();
        }
    }, [lang]);

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "full_name",
                validationType: "string",
                isRequired: true,
                defaultValue: leadership?.full_name ?? "",
                errorMessage: "Iltimos F.I.O kiriting",
            },
            {
                name: "email",
                validationType: "string",
                isRequired: true,
                defaultValue: leadership?.email ?? "",
                errorMessage: "Iltimos email kiriting",
            },
            {
                name: "position",
                validationType: "string",
                isRequired: true,
                defaultValue: leadership?.position ?? "",
                errorMessage: "Iltimos lavozim kiriting",
            },

            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(leadership?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },
            {
                name: "phone",
                validationType: "string",
                isRequired: true,
                defaultValue: leadership?.phone ? leadership.phone.replace(/^\+/, "") : "",
                errorMessage: "Iltimos telefon raqamini kiriting",
                onSubmit: (value: any) => {
                    if (!value) return null;

                    return value.startsWith("+") ? value : `+${value}`;
                },
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
                defaultValue: Boolean(leadership?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "resume",
                validationType: "array",
                defaultValue: leadership?.resume ?? [
                    {
                        title: "",
                        description: "",
                    },
                ],
                onSubmit: (value) =>
                    value.map((item: any) => ({
                        id: item.id && !isNaN(item.id) ? item.id : undefined,
                        title: item.title,
                        description: item.description,
                    })),
            },

            {
                name: "photo",
                validationType: "number",
                isRequired: true,
                defaultValue: leadership?.photo?.id ?? "",
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
    }, [leadership, lang, lang_hash]);

    return (
        <Modal
            header={leadership ? "Rahbariyatni o'zgartirish" : "Rahbariyat yaratish"}
            isOpen={open}
            onClose={onClose}
            size="2xl"
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={leadership?.id}
                fetchFunction={
                    leadership?.id
                        ? (values) => leadershipApi.updateLeadership(leadership.id, values)
                        : leadershipApi.createLeadership
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const isPhoto = formRestProps.watch("photo");
                    return (
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col w-[50%] gap-3">
                                    <FormFields.Input
                                        label="F.I.O"
                                        name="full_name"
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />

                                    <FormFields.Input
                                        label="Email"
                                        name="email"
                                        setValue={setValue}
                                        radius="sm"
                                        type="email"
                                        {...formRestProps}
                                    />
                                    <FormFields.Input
                                        label="Telefon raqam"
                                        name="phone"
                                        radius="sm"
                                        size="sm"
                                        type="number"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Input
                                        label="Lavozim"
                                        name="position"
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />
                                </div>
                                <div className="w-[50%] flex flex-col gap-3">
                                    <FormFields.FileUpload
                                        accept="image/*"
                                        defaultFiles={
                                            leadership?.photo
                                                ? [leadership.photo as UploadResponse]
                                                : []
                                        }
                                        label=""
                                        multiple={false}
                                        setValue={setValue}
                                        isOnly={["img"]}
                                        name="photo"
                                        {...formRestProps}
                                    />
                                    <div className={`${isPhoto && " mt-3"}`}>
                                        <FormFields.Input
                                            label="Tartib raqami"
                                            name="sort"
                                            radius="sm"
                                            setValue={setValue}
                                            type="number"
                                            {...formRestProps}
                                        />
                                    </div>
                                </div>
                            </div>
                            <ResumeFields
                                name="resume"
                                defaultValue={
                                    leadership?.resume ?? [
                                        {
                                            title: "",
                                            description: "",
                                        },
                                    ]
                                }
                                setValue={setValue}
                            />
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {leadership?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
