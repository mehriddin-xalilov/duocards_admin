import { useState } from "react";

import { addToast, Button, Modal, ModalBody, ModalContent, Spinner } from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { Editor } from "@/components/Editor";
import { TagModeSelect } from "@/components/Fields/CreatableSelect";
import GallerySelect from "@/components/Gallery";

import { Form, FormFields } from "@/components";
import { useUser } from "@/hooks/useUser";
import { toLocalISO } from "@/services";
import { CategoriesApi } from "@/services/api/categories.api";
import { MainTagApi } from "@/services/api/main-tag.api";
import { newsApi } from "@/services/api/news.api";
import { TagsApi } from "@/services/api/tags.api";
import { userApi } from "@/services/api/user.api";

export function NewsCreate() {
    const search = useSearch({ from: "/_main" });
    const lang = search.lang ? search.lang : "oz";
    const { user } = useUser();
    const role = user?.user_role?.role;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any>({
        title: "",
        description: "",
        content: "",
    });

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Yangilik muvaffaqiyatli yaratildi",
        });
        navigate({ to: `/news?lang=${lang}` });
    };

    return (
        <div className="w-full">
            <Form
                key={lang}
                fetchFunction={newsApi.createNews}
                fields={[
                    {
                        name: "title",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos sarlavhani kiriting",
                    },
                    {
                        name: "big_tag_id",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: "",
                        errorMessage: "Iltimos asosiy tegni tanlang",
                        onSubmit: (value) => value && Number(value),
                    },
                    {
                        name: "author_id",
                        validationType: "string",
                        isRequired: false,
                        defaultValue: "59",
                        errorMessage: "Iltimos asosiy tegni tanlang",
                        onSubmit: (value) => value && Number(value),
                    },
                    {
                        name: "description",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos tavsifni kiriting",
                    },

                    {
                        name: "link",
                        validationType: "string",
                        defaultValue: "",
                        isRequired: false,
                        errorMessage: "Iltimos video uchun link kiriting",
                    },

                    {
                        name: "type",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos turni tanlang",
                        defaultValue: "1",
                        onSubmit: (value) => String(value),
                    },
                    {
                        name: "content",
                        validationType: "string",
                        isRequired: true,
                        errorMessage: "Iltimos contentni kiriting",
                    },
                    {
                        name: "slug",
                        validationType: "string",
                        isRequired: false,
                        errorMessage: "Iltimos slugni kiriting",
                    },
                    {
                        name: "categories",
                        validationType: "array",
                        isRequired: false,
                        defaultValue: [],
                        errorMessage: "Iltimos kategoriya tanlang",
                    },
                    {
                        name: "tags",
                        validationType: "array",
                        isRequired: false,
                        defaultValue: [],
                        errorMessage: "Iltimos tag tanlang",
                        onSubmit: (value: any) => value && value?.map((item: any) => item.value),
                    },
                    {
                        name: "photo",
                        validationType: "number",
                        isRequired: true,
                        errorMessage: "Iltimos rasm yuklang",
                    },

                    {
                        name: "publish_time",
                        validationType: "any",
                        isRequired: true,
                        defaultValue: now(getLocalTimeZone()),
                        errorMessage: "Iltimos amal qilish muddatini kiriting",
                        onSubmit: (value: any) => toLocalISO(value),
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
                    {
                        name: "show_photo",
                        defaultValue: true,
                        validationType: "boolean",
                        isRequired: false,
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "editor_choice",
                        validationType: "boolean",
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "digest",
                        validationType: "boolean",
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "pinned",
                        validationType: "boolean",
                        onSubmit: (value) => (value ? 1 : 0),
                    },
                    {
                        name: "show_author",
                        validationType: "boolean",
                        onSubmit: (value) => (value ? 1 : 0),
                    },

                    {
                        name: "seo_title",
                        validationType: "string",
                    },
                    {
                        name: "seo_description",
                        validationType: "string",
                    },
                    {
                        name: "seo_keywords",
                        defaultValue: [],
                        validationType: "array",
                        onSubmit: (keywords: any) => keywords.join(","),
                    },
                ]}
                onSuccess={onSuccess}
                onValuesChange={(val) => {
                    console.log(val);
                }}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    const type = Number(formRestProps.watch("type"));
                    const gallery_id = Number(formRestProps.watch("gallery_id"));

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
                                        </h3>
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
                                    </div>
                                    <FormFields.AsyncMultiSelect
                                        isMulti
                                        createFunction={(title) =>
                                            TagsApi.createTags({ title, lang: lang })
                                        }
                                        fetchFunction={TagsApi.getTags}
                                        name="tags"
                                        optionLabel={(opt) => opt.title}
                                        optionValue="id"
                                        placeholder="Teglar"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.AsyncAutocomplete
                                        fetchFunction={MainTagApi.getMainTags}
                                        label="Asosiy Teg"
                                        name="big_tag_id"
                                        optionLabel={`title`}
                                        optionValue="id"
                                        params={{ _l: lang, per_page: 1000 }}
                                        {...formRestProps}
                                    />
                                    <FormFields.AsyncSelect
                                        fetchFunction={userApi.getUsers}
                                        label="Muallif"
                                        name="author_id"
                                        optionLabel={`name`}
                                        optionValue="id"
                                        params={{ _l: lang, per_page: 1000 }}
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
                                        defaultValue={now(getLocalTimeZone())}
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
                                        isDisabled={!formRestProps.watch("author_id")}
                                    />
                                    <FormFields.Switch
                                        label="Muharrir tanlovi"
                                        name="editor_choice"
                                        setValue={setValue}
                                        {...formRestProps}
                                    />
                                    <FormFields.Switch
                                        isDisabled={role === "writer" ? true : false}
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
                                        label="Sarlavha"
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
                                        placeholder="Teglar..."
                                        onChange={(values) => setValue("seo_keywords", values)}
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            color="default"
                                            isLoading={isLoading}
                                            radius="sm"
                                            type="button"
                                            onPress={() => {
                                                setPreviewData({
                                                    title: formRestProps.watch("title"),
                                                    description: formRestProps.watch("description"),
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
                                            isLoading={isLoading}
                                            radius="sm"
                                            type="submit"
                                        >
                                            {"Yaratish"}
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
                    );
                }}
            </Form>

            <Modal isOpen={isPreviewOpen} size="full" onOpenChange={setIsPreviewOpen}>
                <ModalContent>
                    <ModalBody className="p-6">
                        {previewData ? (
                            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
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
