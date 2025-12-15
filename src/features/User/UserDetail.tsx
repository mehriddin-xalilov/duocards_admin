import { useEffect, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { TabComponent } from "./Tabs";

import { Form, FormFields, Modal } from "@/components";
import { userApi } from "@/services/api/user.api";

export const UserDetail = (props: any) => {
    const queryClient = useQueryClient();
    const [filteredData, setFilteredData] = useState<{
        bio: string;
        firstname: string;
        id: number;
        lang: string;
        lastname: string;
        position: string;
    }>({
        bio: "",
        firstname: "",
        id: 0,
        lang: "",
        lastname: "",
        position: "",
    });
    const {
        setUserDetail,
        userDetail: { detail, open },
    } = props;
    const onSuccess = () => {
        setUserDetail({ open: false });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Foydalanuvchi muvaffaqiyatli yaratildi",
        });
    };

    const onChange = (e: any) => {
        if (detail) {
            setFilteredData(detail.filter((item: any) => item.lang === e)[0]);
        }
    };

    useEffect(() => {
        if (detail) {
            setFilteredData(detail.filter((item: any) => item.lang === "oz")[0]);
        }
    }, [detail]);

    return (
        <Modal
            header={detail ? "Foydalanuvchini o'zgartirish" : "Foydalanuvchi yaratish"}
            isOpen={open}
            onClose={() => setUserDetail({ open: false })}
        >
            <>
                {" "}
                <TabComponent modal={true} onChange={onChange} />
                <Form
                    key={filteredData?.id}
                    fetchFunction={(values) => userApi.updateUserDetails(filteredData.id, values)}
                    fields={[
                        {
                            name: "firstname",
                            validationType: "string",
                            isRequired: true,
                            defaultValue: filteredData?.firstname ?? "",
                            errorMessage: "Iltimos ismni kiriting",
                        },
                        {
                            name: "lastname",
                            validationType: "string",
                            isRequired: true,
                            defaultValue: filteredData?.lastname ?? "",
                            errorMessage: "Iltimos familiya kiriting",
                        },
                        {
                            name: "position",
                            validationType: "string",
                            isRequired: true,
                            defaultValue: filteredData?.position ?? "",
                            errorMessage: "Iltimos pozitsiya kiriting",
                        },
                        {
                            name: "bio",
                            validationType: "string",
                            isRequired: true,
                            defaultValue: filteredData?.bio ?? "",
                            errorMessage: "Iltimos bio kiriting",
                        },
                    ]}
                    onSuccess={onSuccess}
                >
                    {({ isLoading, ...formRestProps }) => {
                        return (
                            <div className="flex flex-col gap-2">
                                <FormFields.Input
                                    label="Ism"
                                    name="firstname"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Familiya"
                                    name="lastname"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Input
                                    label="Pozitsiya"
                                    name="position"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <FormFields.Textarea
                                    label="Bio"
                                    name="bio"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />

                                <Button
                                    color="primary"
                                    isLoading={isLoading}
                                    radius="sm"
                                    type="submit"
                                >
                                    {detail ? "O'zgartirish" : "Yaratish"}
                                </Button>
                            </div>
                        );
                    }}
                </Form>
            </>
        </Modal>
    );
};
