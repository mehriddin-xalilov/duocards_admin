import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { bannerApi, BannerItemType } from "@/services/api/banner.api";
import { ValidationField } from "@/components/Form/types";

type BannerModalProps = {
    setBannerModal: ({ open, banner }: { open: boolean; banner?: BannerItemType }) => void;
    bannerDataModal: { open: boolean; banner?: BannerItemType };
};

export const BannerModal = (props: BannerModalProps) => {
    const {
        bannerDataModal: { open, banner },
        setBannerModal,
    } = props;
    const queryClient = useQueryClient();
    const [lang, setLang] = useState("uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);

    const onClose = () => {
        setBannerModal({ open: false });
        setLang("uz");
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["banner"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Banner muvaffaqiyatli yaratildi",
        });
    };

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: `title_uz`,
                validationType: "string",
                defaultValue: banner?.title?.uz ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            // {
            //     name: `title_oz`,
            //     validationType: "string",
            //     defaultValue: banner?.title?.oz ?? "",
            //     errorMessage: "Iltimos sarlavhani kiriting",
            // },

            {
                name: `title_ru`,
                validationType: "string",
                defaultValue: banner?.title?.ru ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            // {
            //     name: `title_en`,
            //     validationType: "string",
            //     defaultValue: banner?.title?.en ?? "",
            //     errorMessage: "Iltimos sarlavhani kiriting",
            // },
            // {
            //     name: `description_uz`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.uz ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_oz`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.oz ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_en`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.en ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            // {
            //     name: `description_ru`,
            //     validationType: "string",
            //     defaultValue: banner?.description?.ru ?? "",
            //     errorMessage: "Iltimos tavsifni kiriting",
            // },
            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(banner?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "photo",
                validationType: "number",
                isRequired: true,
                defaultValue: banner?.photo?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
        ];

        return baseFields;
    }, [banner]);

    console.log(lang, banner);

    return (
        <Modal
            header={banner ? "Bannerni o'zgartirish" : "Banner yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={(e) => setLang(e)} />
            <Form
                key={banner?.id}
                fetchFunction={(values) => {
                    console.log(values, "submit");
                    const payload = {
                        title: {
                            uz: values.title_uz,
                            // oz: values.title_oz,
                            // en: values.title_en,
                            ru: values.title_ru,
                        },
                        // description: {
                        //     uz: values.description_uz,
                        //     // oz: values.description_oz,
                        //     // en: values.description_en,
                        //     ru: values.description_ru,
                        // },
                        status: values.status,
                        photo: values.photo,
                    };

                    return banner?.id
                        ? bannerApi.updateBanner(banner.id, payload)
                        : bannerApi.createBanner(payload);
                }}
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            {/* {lang === "oz" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_oz`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_oz`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />
                                </>
                            )} */}

                            {String(lang) === "ru" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_ru`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    {/* <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_ru`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    /> */}
                                </>
                            )}
                            {/* {lang === "en" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_en`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_en`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    />
                                </>
                            )} */}
                            {String(lang) === "uz" && (
                                <>
                                    <FormFields.Textarea
                                        label="Sarlavha"
                                        name={`title_uz`}
                                        radius="sm"
                                        type="text"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    {/* <FormFields.Textarea
                                        label="Tavsif"
                                        name={`description_uz`}
                                        setValue={setValue}
                                        radius="sm"
                                        type="text"
                                        {...formRestProps}
                                    /> */}
                                </>
                            )}

                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={banner?.photo ? [banner.photo as UploadResponse] : []}
                                label="Rasm yuklash"
                                multiple={false}
                                setValue={setValue}
                                isOnly={["img"]}
                                name="photo"
                                {...formRestProps}
                            />
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {banner?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
