import { addToast, Button } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { Editor } from "@/components/Editor";

import { Form, FormFields } from "@/components";
import { pagesApi } from "@/services/api/pages.api";
import { documentApi } from "@/services/api/documents.api";
import { leadershipApi } from "@/services/api/leadership.api";
import { MenusApi } from "@/services/api/menu.api";
import GallerySelect from "@/components/Gallery";

export function PageCreate() {
    const search = useSearch({ from: "/_main" });
    const lang = search.lang ? search.lang : "uz";
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["pages"] });
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Sahifa muvaffaqiyatli yaratildi",
        });
        navigate({ to: `/pages?lang=${lang}` });
    };

    return (
        <div className="w-full">
            <Form
                key={lang}
                fetchFunction={pagesApi.createPage}
                fields={[
                    {
                        name: "title",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos sarlavhani kiriting",
                    },
                    {
                        name: "menuitem_id",
                        validationType: "string",
                        errorMessage: "Iltimos sarlavhani kiriting",
                    },
                    {
                        name: "items",
                        validationType: "any",
                        errorMessage: "Iltimos sarlavhani kiriting",
                        onSubmit: (value: any) => {
                            if (typeof value === "string") {
                                return value.split(",").map((v) => Number(v.trim()));
                            }
                            if (Array.isArray(value)) {
                                return value.map((v) => Number(v));
                            }
                            return [];
                        },
                    },
                    {
                        name: "type",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos turni tanlang",
                        defaultValue: "0",
                        onSubmit: (value) => Number(value),
                    },
                    {
                        name: "content",
                        validationType: "string",
                        errorMessage: "Iltimos contentni kiriting",
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
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                ]}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const type = Number(formRestProps.watch("type"));
                    return (
                        <Editor
                            editorContent={
                                <div className="flex flex-col gap-4">
                                    <div className="border-b-1 border-dashed border-[#cfcfcf] relative mb-[20px]">
                                        <div className="absolute -left-[120px] top-[50%] transform-[translateY(-50%)] w-[100px] rounded-[10px] bg-primary text-white text-xs p-1 pl-3 shadow-md">
                                            Sarlavha
                                            <div className="absolute right-[-4px] top-[6.5px] h-0 w-0 border-y-[5px] border-y-transparent border-l-[5px] border-l-primary" />
                                        </div>
                                        <FormFields.Textarea
                                            editor={true}
                                            label="Sarlavha"
                                            name="title"
                                            placeholder="Sarlavha"
                                            radius="sm"
                                            setValue={setValue}
                                            size="sm"
                                            type="text"
                                            {...formRestProps}
                                        />
                                    </div>
                                    {/* <div className="border-b-1 border-dashed border-[#cfcfcf] relative mb-[20px]">
                                        <div className="absolute -left-[120px] top-[50%] transform-[translateY(-50%)] w-[100px] rounded-[10px] bg-primary text-white text-xs p-1 pl-3 shadow-md">
                                            Lid
                                            <div className="absolute right-[-4px] top-[6.5px] h-0 w-0 border-y-[5px] border-y-transparent border-l-[5px] border-l-primary" />
                                        </div>
                                        <FormFields.Textarea
                                            editor={true}
                                            label="Lid"
                                            name="description"
                                            placeholder="Lid"
                                            radius="sm"
                                            setValue={setValue}
                                            size="sm"
                                            type="text"
                                            {...formRestProps}
                                        />
                                    </div> */}
                                </div>
                            }
                            isMenu={true}
                            menuContent={
                                <div className="flex flex-col gap-4">
                                    <FormFields.RadioGroup
                                        label="Turi"
                                        name="type"
                                        options={[
                                            { label: "Oddiy sahifa", value: 0 },
                                            { label: "Dokument sahifa", value: 1 },
                                            { label: "Galleriya sahifa", value: 2 },
                                            { label: "Rahbariyat sahifa", value: 3 },
                                        ]}
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.AsyncSelect
                                        fetchFunction={MenusApi.getMenusForPage}
                                        label="Menular"
                                        name="menuitem_id"
                                        selectionMode="single"
                                        optionLabel={(item) => item.name[lang] ?? item.name.uz}
                                        optionValue={(item) => item.id}
                                        params={{ _l: lang, per_page: 1000 }}
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    {type === 2 && (
                                        <GallerySelect
                                            setValue={setValue}
                                            watch={formRestProps.watch}
                                        />
                                    )}
                                    {type === 1 && (
                                        <FormFields.AsyncSelect
                                            fetchFunction={documentApi.getDocuments}
                                            label="Dokumentlar"
                                            name="items"
                                            selectionMode="multiple"
                                            optionLabel={(item) =>
                                                item.title[lang] ?? item.title.uz
                                            }
                                            onSelect={(e) => console.log(e)}
                                            optionValue={(item) => item.id}
                                            params={{ _l: lang, per_page: 1000 }}
                                            setValue={setValue}
                                            {...formRestProps}
                                        />
                                    )}
                                    {type === 3 && (
                                        <FormFields.AsyncSelect
                                            fetchFunction={() =>
                                                leadershipApi.getLeaderships({
                                                    _l: lang,
                                                })
                                            }
                                            label="Rahbariyat"
                                            name="items"
                                            selectionMode="multiple"
                                            optionLabel="full_name"
                                            onSelect={(e) => console.log(e)}
                                            optionValue={(item) => item.id}
                                            params={{ _l: lang, per_page: 1000 }}
                                            setValue={setValue}
                                            {...formRestProps}
                                        />
                                    )}

                                    <FormFields.Switch
                                        label="Status"
                                        name="status"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <Button
                                        color="primary"
                                        isLoading={isLoading}
                                        radius="sm"
                                        type="submit"
                                    >
                                        {"Yaratish"}
                                    </Button>
                                </div>
                            }
                            onChange={(value) => {
                                setValue("content", value, { shouldValidate: true });
                            }}
                        />
                    );
                }}
            </Form>
        </div>
    );
}
