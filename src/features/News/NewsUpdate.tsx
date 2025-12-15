import { useEffect, useMemo, useState } from "react";

import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    Spinner,
    Tab,
    Tabs,
} from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { X } from "lucide-react";

import { Editor } from "@/components/Editor";
import { TagModeSelect } from "@/components/Fields/CreatableSelect";
import GallerySelect from "@/components/Gallery";

import { Form, FormFields } from "@/components";
import { useUser } from "@/hooks/useUser";
import { toLocalISO } from "@/services";
import { CategoriesApi } from "@/services/api/categories.api";
import { UploadResponse } from "@/services/api/file.api";
import { MainTagApi } from "@/services/api/main-tag.api";
import { newsApi } from "@/services/api/news.api";
import { TagsApi } from "@/services/api/tags.api";
import { userApi } from "@/services/api/user.api";

type New = {
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

export function NewsUpdate() {
    const search = useSearch({ from: "/_main" });
    const { id } = useParams({ from: "/_main/news/update/$id" });
    const [activeLang, setActiveLang] = useState(search.lang ? search.lang : "oz");
    const lang = search.lang ? search.lang : "oz";
    const queryClient = useQueryClient();
    const [newInfo, setNewInfo] = useState<any>({});
    const [lang_hash, setLangHash] = useState("");
    const [btnText, setBtnText] = useState("O'zgartirish");
    const [tabLoading, setTabLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { user } = useUser();
    const role = user?.user_role?.role;
    const [previewData, setPreviewData] = useState<any>({
        title: "",
        description: "",
        content: "",
    });

    const navigate = useNavigate();

    const { data: news } = useQuery<{ data: New }>({
        queryKey: ["posts-id", id],
        queryFn: () => newsApi.getNew(id),
        staleTime: 0,
    });

    const translations = useMemo(
        () => [...(news?.data?.translations || []), { id: news?.data?.id || 0, lang: lang }],
        [news],
    );

    useEffect(() => {
        setNewInfo(news?.data);
        setLangHash(news?.data?.lang_hash || "");
    }, [news]);

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["posts-id", id] });
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Yangilik muvaffaqiyatli yaratildi",
        });
        navigate({ to: `/news?lang=${lang}` });
    };

    const fetchNew = async (key: string) => {
        setTabLoading(true);
        try {
            const item = translations?.find((item) => item.lang === key);

            if (item && item.id !== 0) {
                const res = await newsApi.getNew(item.id);

                if (res.data) {
                    setNewInfo(res.data);
                    setBtnText("O'zgartirish");
                } else {
                }
            } else {
                setBtnText("Yaratish");
                setNewInfo(null);
            }
        } finally {
            setTabLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Form
                key={newInfo?.id}
                fetchFunction={
                    btnText !== "Yaratish"
                        ? (values) => newsApi.updateNews(newInfo.id, values)
                        : newsApi.createNews
                }
                fields={[
                    {
                        name: "title",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: newInfo?.title,
                        errorMessage: "Iltimos sarlavhani kiriting",
                    },
                    {
                        name: "big_tag_id",
                        validationType: "any",
                        isRequired: false,
                        defaultValue: newInfo?.big_tag_id ? String(newInfo?.big_tag_id) : "",
                        errorMessage: "Iltimos asosiy tegni tanlang",
                    },
                    {
                        name: "author_id",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: newInfo?.author_id ? String(newInfo?.author_id) : "",
                        errorMessage: "Iltimos asosiy tegni tanlang",
                    },
                    {
                        name: "description",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: newInfo?.description,
                        errorMessage: "Iltimos tavsifni kiriting",
                    },

                    {
                        name: "link",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: newInfo?.link || "",
                        errorMessage: "Iltimos video uchun link kiriting",
                    },

                    {
                        name: "type",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos turni tanlang",
                        defaultValue: String(newInfo?.type),
                        onSubmit: (value) => String(value),
                    },
                    {
                        name: "content",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: newInfo?.content,
                        errorMessage: "Iltimos contentni kiriting",
                    },
                    {
                        name: "categories",
                        validationType: "array",
                        isRequired: false,
                        defaultValue: newInfo?.categories
                            ? newInfo?.categories.map((cat: any) => cat.id)
                            : "",
                        errorMessage: "Iltimos kategoriya tanlang",
                    },
                    {
                        name: "tags",
                        validationType: "array",
                        isRequired: false,
                        defaultValue: newInfo?.tags
                            ? newInfo.tags.map((t: any) => ({ value: t.id, label: t.title }))
                            : [],
                        errorMessage: "Iltimos tag tanlang",
                        onSubmit: (value: any) => value && value?.map((item: any) => item.value),
                    },
                    {
                        name: "photo",
                        validationType: "number",
                        isRequired: true,
                        defaultValue: newInfo?.photo?.id,
                        errorMessage: "Iltimos rasm yuklang",
                    },

                    {
                        name: "lang_hash",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: lang_hash,
                    },

                    {
                        name: "publish_time",
                        validationType: "any",
                        isRequired: true,

                        defaultValue:
                            newInfo?.publish_time &&
                            parseZonedDateTime(newInfo?.publish_time.replace(" ", "T") + "[UTC]"),
                        errorMessage: "Iltimos amal qilish muddatini kiriting",
                        onSubmit: (value: any) => toLocalISO(value),
                    },

                    {
                        name: "lang",
                        validationType: "string",
                        isRequired: true,
                        defaultValue: activeLang,
                    },

                    {
                        name: "status",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.status),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "show_photo",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.show_photo),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "is_notification",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.is_notification),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "slug",
                        validationType: "string",
                        defaultValue: newInfo?.slug,
                        isRequired: true,
                        errorMessage: "Iltimos slugni kiriting",
                    },
                    {
                        name: "digest",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.digest),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "pinned",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.pinned),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "show_author",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.show_author),
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "editor_choice",
                        validationType: "boolean",
                        defaultValue: Boolean(newInfo?.editor_choice),
                        onSubmit: (value) => (value ? 1 : 0),
                    },

                    {
                        name: "seo_title",
                        validationType: "string",
                        defaultValue: newInfo?.seo?.seo_title,
                        isRequired: true,
                        errorMessage: "Iltimos SEO sarlavhani kiriting",
                    },
                    {
                        name: "seo_description",
                        validationType: "string",
                        defaultValue: newInfo?.seo?.seo_description,
                        isRequired: true,
                        errorMessage: "Iltimos SEO tasnifini kiriting",
                    },
                    {
                        name: "seo_keywords",
                        validationType: "array",
                        defaultValue: newInfo?.seo?.seo_keywords
                            ?.split(",")
                            .map((item: string) => ({ label: item, value: item })),
                        isRequired: true,
                        errorMessage: "Iltimos SEO teglarini kiriting",
                    },
                ]}
                onSuccess={onSuccess}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const type = Number(formRestProps.watch("type"));
                    const gallery_id = Number(formRestProps.watch("gallery_id"));

                    return (
                        <>
                            {tabLoading ? (
                                <div className="flex justify-center items-center py-4 w-full h-[100vh]">
                                    <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary" />
                                </div>
                            ) : (
                                <Editor
                                    defaultValue={newInfo?.content ?? ""}
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
                                            <div className="border-b-1 border-dashed border-[#cfcfcf] relative mb-[20px]">
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
                                                    fetchNew(key as string);
                                                }}
                                            >
                                                <Tab key="oz" title="Ўзбекча" />
                                                <Tab key="uz" title="O‘zbekcha" />
                                                <Tab key="ru" title="Русский" />
                                                <Tab key="en" title="English" />
                                            </Tabs>
                                            <FormFields.RadioGroup
                                                label="Turi"
                                                name="type"
                                                options={[
                                                    { label: "Oddiy post", value: 1 },
                                                    { label: "Foto post", value: 2 },
                                                    { label: "Video post", value: 3 },
                                                ]}
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            {type === 2 && (
                                                <GallerySelect
                                                    setValue={setValue}
                                                    watch={formRestProps.watch}
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-[Inter] font-medium text-[16px] text-black mb-2">
                                                    KATEGORIYALAR
                                                    <FormFields.TreeCheckBox
                                                        fetchFunction={() =>
                                                            CategoriesApi.getCategories({
                                                                include: "children",
                                                                per_page: 10000,
                                                            })
                                                        }
                                                        name="categories"
                                                        {...formRestProps}
                                                    />
                                                </h3>
                                            </div>

                                            <FormFields.AsyncMultiSelect
                                                isMulti
                                                createFunction={(title) =>
                                                    TagsApi.createTags({ title, lang: activeLang })
                                                }
                                                defaultValue={newInfo?.tags}
                                                fetchFunction={TagsApi.getTags}
                                                name="tags"
                                                optionLabel={(opt) => opt.title}
                                                optionValue="id"
                                                placeholder="Teglar"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />

                                            <FormFields.AsyncAutocomplete
                                                defaultSelectedKey={newInfo?.big_tag_id}
                                                fetchFunction={MainTagApi.getMainTags}
                                                label="Asosiy Teg"
                                                name="big_tag_id"
                                                optionLabel={`title`}
                                                optionValue="id"
                                                params={{ _l: activeLang }}
                                                {...formRestProps}
                                            />
                                            <FormFields.AsyncSelect
                                                fetchFunction={userApi.getUsers}
                                                label="Mualliflar"
                                                name="author_id"
                                                optionLabel={`name`}
                                                optionValue="id"
                                                params={{ _l: activeLang, per_page: 1000 }}
                                                selectionMode="single"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            {type === 3 && (
                                                <FormFields.Input
                                                    isRequired={true}
                                                    label="Video uchun link"
                                                    name="link"
                                                    radius="sm"
                                                    setValue={setValue}
                                                    type="string"
                                                    {...formRestProps}
                                                />
                                            )}

                                            <FormFields.DatePicker
                                                defaultValue={
                                                    newInfo?.publish_time &&
                                                    parseZonedDateTime(
                                                        newInfo?.publish_time.replace(" ", "T") +
                                                            "[UTC]",
                                                    )
                                                }
                                                label="Nashr qilinish vaqti"
                                                name="publish_time"
                                                radius="sm"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Textarea
                                                label="Slug"
                                                name="slug"
                                                radius="sm"
                                                setValue={setValue}
                                                size="sm"
                                                type="text"
                                                {...formRestProps}
                                            />
                                            <FormFields.FileUpload
                                                accept="image/*"
                                                defaultFiles={
                                                    newInfo?.photo
                                                        ? [newInfo.photo as UploadResponse]
                                                        : []
                                                }
                                                label="Rasm yuklash"
                                                multiple={false}
                                                name="photo"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Bosh sahifada ko'rsatish"
                                                name="pinned"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Kun yangiliklari"
                                                name="digest"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />

                                            <FormFields.Switch
                                                label="Muallifni ko'rsatish"
                                                name="show_author"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Muharrir tanlovi"
                                                name="editor_choice"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Status"
                                                name="status"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Bildirishnoma yuborish"
                                                name="is_notification"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Switch
                                                label="Yangilik ichida rasmni ko'rsatish"
                                                name="show_photo"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <h3>SEO</h3>
                                            <FormFields.Textarea
                                                label="SEO"
                                                name="seo_title"
                                                radius="sm"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <FormFields.Textarea
                                                label="Tasnif"
                                                name="seo_description"
                                                radius="sm"
                                                setValue={setValue}
                                                {...formRestProps}
                                            />
                                            <TagModeSelect
                                                defaultValue={formRestProps.watch("seo_keywords")}
                                                placeholder="Kalit so'zlar..."
                                                onChange={(values) =>
                                                    setValue("seo_keywords", values)
                                                }
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    color="default"
                                                    isDisabled={role === "writer" ? true : false}
                                                    isLoading={isLoading}
                                                    radius="sm"
                                                    type="button"
                                                    onPress={() => {
                                                        setPreviewData({
                                                            title: formRestProps.watch("title"),
                                                            description:
                                                                formRestProps.watch("description"),
                                                            content: formRestProps.watch("content"),
                                                        });

                                                        setIsPreviewOpen(true);
                                                    }}
                                                >
                                                    {`Saytda ko'rinishi`}
                                                </Button>

                                                <Button
                                                    className="flex-1"
                                                    color="primary"
                                                    isDisabled={role === "writer" ? true : false}
                                                    isLoading={isLoading}
                                                    radius="sm"
                                                    type="submit"
                                                >
                                                    {btnText}
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    newWord={`[gallery-${gallery_id}]`}
                                    watch={formRestProps.watch}
                                    onChange={(value) => {
                                        setValue("content", value, { shouldValidate: true });
                                    }}
                                />
                            )}
                        </>
                    );
                }}
            </Form>
            <Modal
                classNames={{
                    closeButton: "hidden",
                }}
                isDismissable={false}
                isOpen={isPreviewOpen}
                size="full"
                onOpenChange={setIsPreviewOpen}
            >
                <ModalContent>
                    <Button
                        isIconOnly
                        className="group fixed top-4 right-4 rounded-full hover:bg-gray-100 transition-all z-50"
                        color="danger"
                        size="lg"
                        variant="ghost"
                        onPress={() => setIsPreviewOpen(false)}
                    >
                        <X className="text-red-500 group-hover:text-white" size={24} />
                    </Button>

                    <ModalBody className="p-6 overflow-y-scroll">
                        {previewData ? (
                            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 relative">
                                <h1 className="text-2xl font-bold mb-3">{previewData.title}</h1>

                                <p className="text-gray-600 mb-5">{previewData.description}</p>

                                {previewData.photo && (
                                    <img
                                        alt="preview"
                                        className="rounded-xl mb-6"
                                        src={
                                            typeof previewData.photo === "string"
                                                ? previewData.photo
                                                : URL.createObjectURL(previewData.photo[0])
                                        }
                                    />
                                )}

                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: previewData.content,
                                    }}
                                    className="prose max-w-none"
                                />
                            </div>
                        ) : (
                            <Spinner />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
