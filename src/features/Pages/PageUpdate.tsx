import { useEffect, useMemo, useState } from "react";

import { addToast, Button, Tab, Tabs } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import { Editor } from "@/components/Editor";
import { MenusApi } from "@/services/api/menu.api";
import { Form, FormFields } from "@/components";
import { pagesApi } from "@/services/api/pages.api";
import { leadershipApi } from "@/services/api/leadership.api";
import { documentApi } from "@/services/api/documents.api";
import GallerySelect from "@/components/Gallery";
type Page = {
    id: number;
    title: string;
    description: string;
    content: string;
    status: number;
    lang: string;
    slug: string;
    translations: [];
    lang_hash: string;
};
export function PageUpdate() {
    const search = useSearch({ from: "/_main" });
    const { id } = useParams({ from: "/_main/pages/update/$id" }); // <-- shu joydan olasiz
    const [activeLang, setActiveLang] = useState(search.lang ? search.lang : "uz");
    const lang = search.lang ? search.lang : "uz";
    const queryClient = useQueryClient();
    const [pageInfo, setPageInfo] = useState<any>({});
    const [lang_hash, setLangHash] = useState("");
    const [btnText, setBtnText] = useState("O'zgartirish");
    const [tabLoading, setTabLoading] = useState(false);

    const { data: page } = useQuery<{ data: Page }>({
        queryKey: ["page", id],
        queryFn: () => pagesApi.getPage(id),
    });

    const translations = useMemo(
        () => [...(page?.data?.translations || []), { id: page?.data?.id || 0, lang: lang }],
        [page],
    );

    useEffect(() => {
        setPageInfo(page?.data);
        setLangHash(page?.data?.lang_hash || "");
    }, [page]);
    const navigate = useNavigate();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["page", id] });
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Sahifa muvaffaqiyatli yaratildi",
        });
        navigate({ to: `/pages?lang=${lang}` });
    };

    const fetchPage = async (key: string) => {
        setTabLoading(true);
        try {
            const item = translations?.find((item) => item.lang === key);

            if (item && item.id !== 0) {
                setBtnText("O'zgartirish");
                const res = await pagesApi.getPage(item.id);

                if (res.data) {
                    setPageInfo(res.data);
                }
            } else {
                setBtnText("Yaratish");
                setPageInfo(null);
            }
        } finally {
            setTabLoading(false);
        }
    };
    const type = (pageInfo && pageInfo?.type) || 0;
    const documents =
        type === 1 && pageInfo?.documents.map((item: any) => String(item.id)).join(",");
    const galleries = type === 2 && pageInfo?.galleries;
    const managements =
        type === 3 && pageInfo?.managements.map((item: any) => String(item.id)).join(",");
    const ItemsDefaultVal = documents || galleries || managements;
    return (
        <div className="w-full">
            <Form
                key={pageInfo?.id}
                fetchFunction={
                    btnText !== "Yaratish"
                        ? (values) => pagesApi.updatePage(pageInfo.id, values)
                        : pagesApi.createPage
                }
                fields={[
                    {
                        name: "title",
                        validationType: "string",
                        defaultValue: pageInfo?.title ?? "",
                        isRequired: true,
                        errorMessage: "Iltimos sarlavhani kiriting",
                    },
                    {
                        name: "type",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos turni tanlang",
                        defaultValue: pageInfo?.type ? String(pageInfo?.type) : "0",
                        onSubmit: (value) => Number(value),
                    },
                    {
                        name: "items",
                        validationType: "any",
                        errorMessage: "Iltimos sarlavhani kiriting",
                        defaultValue: ItemsDefaultVal,
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
                        name: "content",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: pageInfo?.content ?? "",
                        errorMessage: "Iltimos contentni kiriting",
                    },
                    {
                        name: "menuitem_id",
                        validationType: "string",
                        errorMessage: "Iltimos sarlavhani kiriting",
                        defaultValue: pageInfo?.menuitem_id ? String(pageInfo?.menuitem_id) : "",
                    },
                    {
                        name: "lang",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: activeLang,
                    },
                    {
                        name: "lang_hash",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: lang_hash,
                    },
                    {
                        name: "status",
                        defaultValue: Boolean(pageInfo?.status) ?? false,
                        validationType: "boolean",
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                ]}
                onValuesChange={(val) => console.log(val)}
                onSuccess={onSuccess}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const type = Number(formRestProps.watch("type"));
                    return (
                        <>
                            {tabLoading ? (
                                <div className="flex justify-center items-center py-4 w-full h-[100vh]">
                                    <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary" />
                                </div>
                            ) : (
                                <Editor
                                    defaultValue={pageInfo?.content ?? ""}
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
                                        </div>
                                    }
                                    isMenu={true}
                                    menuContent={
                                        <div className="flex flex-col gap-4">
                                            <Tabs
                                                className=" overflow-x-auto scrollbar-hide"
                                                selectedKey={activeLang}
                                                onSelectionChange={(key) => {
                                                    setActiveLang(key as string);
                                                    fetchPage(key as string);
                                                }}
                                            >
                                                {/* <Tab key="oz" title="Ўзбекча" /> */}
                                                <Tab key="uz" title="O‘zbekcha" />
                                                <Tab key="ru" title="Русский" />
                                                {/* <Tab key="en" title="English" /> */}
                                            </Tabs>
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
                                                defaultSelectedKeys={[
                                                    String(
                                                        pageInfo?.menuitem_id
                                                            ? pageInfo?.menuitem_id
                                                            : "",
                                                    ),
                                                ]}
                                                optionLabel={(item) =>
                                                    item.name[lang] ?? item.name.uz
                                                }
                                                optionValue={(item) => item.id}
                                                params={{ _l: lang, per_page: 1000 }}
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            {type === 2 && (
                                                <GallerySelect
                                                    setValue={setValue}
                                                    watch={formRestProps.watch("items")}
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
                                                    defaultSelectedKeys={
                                                        pageInfo?.managements
                                                            ? pageInfo.managements.map(
                                                                  (item: any) =>
                                                                      String(
                                                                          item.pivot.management_id,
                                                                      ),
                                                              )
                                                            : []
                                                    }
                                                    optionLabel="full_name"
                                                    onSelect={(e) => console.log(e)}
                                                    optionValue={(item) => item.id}
                                                    params={{ _l: lang, per_page: 1000 }}
                                                    setValue={setValue}
                                                    {...formRestProps}
                                                />
                                            )}
                                            {type === 1 && (
                                                <FormFields.AsyncSelect
                                                    fetchFunction={documentApi.getDocuments}
                                                    label="Dokumentlar"
                                                    name="items"
                                                    defaultSelectedKeys={
                                                        pageInfo?.documents
                                                            ? pageInfo.documents.map((item: any) =>
                                                                  String(item.pivot.document_id),
                                                              )
                                                            : []
                                                    }
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
                                                {btnText}
                                            </Button>
                                        </div>
                                    }
                                    onChange={(value) => {
                                        setValue("content", value, { shouldValidate: true });
                                    }}
                                />
                            )}
                        </>
                    );
                }}
            </Form>
        </div>
    );
}
