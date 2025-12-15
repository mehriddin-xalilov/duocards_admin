import { Button } from "@heroui/button";

import { Form, FormFields } from "../Form";

import GalleryImages from "./GalleryImages";

import { galleryApi } from "@/services/api/gallery.api";
import { Trash } from "lucide-react";

export default function GalleryForm({
    currLang,
    editGallery,
    onSuccess,
    setEditGallery,
    setIsOpen,
    fetchGalleries,
    setSelected,
}: any) {
    const handleDelete = async (id: string) => {
        try {
            await galleryApi.deleteGallery(Number(id));
            setIsOpen(false);
            await fetchGalleries();
            setSelected((prev: any) => prev.filter((i: any) => i !== id));
        } catch (err) {
            console.error("Galleryni o‘chirishda xato:", err);
        }
    };
    return (
        <Form
            key={23}
            fetchFunction={(values) => {
                const payload = {
                    name: {
                        uz: values.title_uz,
                        ru: values.title_ru,
                    },
                    photos: values.photos,
                    slug: values.slug,
                };
                console.log(payload);

                return editGallery
                    ? galleryApi.updateGallery(editGallery.id, payload)
                    : galleryApi.createGallery(payload);
            }}
            fields={[
                {
                    name: "title_uz",
                    validationType: "string",
                    isRequired: false,
                    defaultValue: editGallery?.name?.uz ? editGallery?.name?.uz : "",
                    errorMessage: "Iltimos sarlavhani kiriting",
                },
                {
                    name: "title_ru",
                    validationType: "string",
                    isRequired: false,
                    defaultValue: editGallery?.name?.ru ? editGallery?.name?.ru : "",
                    errorMessage: "Iltimos sarlavhani kiriting",
                },

                {
                    name: "slug",
                    validationType: "string",
                    isRequired: true,
                    defaultValue: editGallery?.slug ? editGallery?.slug : "",
                    errorMessage: "Iltimos slugni kiriting",
                },

                {
                    name: "photos",
                    validationType: "array",
                    defaultValue: editGallery?.photos ? editGallery?.photos : [],
                    errorMessage: "Iltimos sarlavhani kiriting",
                    onSubmit: (values: any) =>
                        editGallery
                            ? values?.map((img: any) => ({
                                  name: {
                                      uz: img?.name_uz,
                                      ru: img?.name_ru,
                                  },
                                  photo: img?.photo?.id ? img?.photo?.id : img?.id,
                              }))
                            : values?.map((img: any) => ({
                                  photo: img?.id || 0,
                                  name: {
                                      uz: img?.name_uz,
                                      ru: img?.name_ru,
                                  },
                              })),
                },
            ]}
            onValuesChange={(val) => console.log(val)}
            onSuccess={onSuccess}
        >
            {({ control, ...formRestProps }) => {
                return (
                    <div className="flex flex-col ">
                        <div className="flex ">
                            <div className="flex flex-col gap-4 w-[30%] mb-[20px] pr-4">
                                {currLang === "uz" && (
                                    <>
                                        <FormFields.Textarea
                                            control={control}
                                            label="Sarlavha"
                                            name="title_uz"
                                            radius="sm"
                                            type="text"
                                            {...formRestProps}
                                        />
                                    </>
                                )}

                                {currLang === "ru" && (
                                    <>
                                        <FormFields.Textarea
                                            control={control}
                                            label="Sarlavha"
                                            name="title_ru"
                                            radius="sm"
                                            type="text"
                                            {...formRestProps}
                                        />
                                    </>
                                )}
                                <FormFields.Input
                                    control={control}
                                    label="Slug"
                                    name="slug"
                                    radius="sm"
                                    size="sm"
                                    type="text"
                                    {...formRestProps}
                                />
                                <Button color="primary" type="submit" variant="shadow">
                                    Saqlash
                                </Button>
                                {editGallery && (
                                    <Button
                                        color="danger"
                                        onPress={() => handleDelete(editGallery?.id)}
                                    >
                                        Fotogallereyani o'chirish <Trash width={15} />
                                    </Button>
                                )}
                            </div>
                            <GalleryImages
                                control={control}
                                currLang={currLang}
                                editGallery={editGallery}
                                formRestProps={formRestProps}
                                setEditGallery={setEditGallery}
                            />
                        </div>
                    </div>
                );
            }}
        </Form>
    );
}
