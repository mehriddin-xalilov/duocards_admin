import { useMemo } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormFields, Modal } from "@/components";
import { UploadResponse } from "@/services/api/file.api";
import { partnerApi, PartnerItemType } from "@/services/api/partner.api";
import { ValidationField } from "@/components/Form/types";

type PartnerModalProps = {
    setPartnerModal: ({ open, partner }: { open: boolean; partner?: PartnerItemType }) => void;
    partnerDataModal: { open: boolean; partner?: PartnerItemType };
};

export const PartnerModal = (props: PartnerModalProps) => {
    const {
        partnerDataModal: { open, partner },
        setPartnerModal,
    } = props;
    const queryClient = useQueryClient();

    const onClose = () => {
        setPartnerModal({ open: false });
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["partners"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Hamkor muvaffaqiyatli yaratildi",
        });
    };

    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "link",
                validationType: "string",
                isRequired: true,
                defaultValue: partner?.link ?? "",
                errorMessage: "Iltimos link kiriting",
            },

            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(partner?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
            {
                name: "sort",
                validationType: "string",
                isRequired: true,
                defaultValue: String(partner?.sort) ?? "",
                errorMessage: "Iltimos tartib raqamini kiriting",
                onSubmit: (value) => Number(value),
            },
            {
                name: "logo",
                validationType: "number",
                isRequired: true,
                defaultValue: partner?.logo?.id ?? "",
                errorMessage: "Iltimos rasm yuklang",
            },
        ];

        return baseFields;
    }, [partner]);

    return (
        <Modal
            header={partner ? "Hamkorni o'zgartirish" : "Hamkor yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <Form
                key={partner?.id}
                fetchFunction={
                    partner?.id
                        ? (values) => partnerApi.updatePartner(partner.id, values)
                        : partnerApi.createPartner
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Link"
                                name="link"
                                setValue={setValue}
                                radius="sm"
                                type="text"
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
                            <FormFields.FileUpload
                                accept="image/*"
                                defaultFiles={partner?.logo ? [partner.logo as UploadResponse] : []}
                                label="Logo yuklash"
                                multiple={false}
                                setValue={setValue}
                                isOnly={["img"]}
                                name="logo"
                                {...formRestProps}
                            />
                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {partner?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
