import { useEffect } from "react";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { FormFields } from "@/components/Form";
import Images from "@/components/Gallery/Images";

export default function GalleryImages({
    control,
    formRestProps,
    editGallery,
    currLang,
    setEditGallery,
}: any) {
    const images = formRestProps.watch("photos");

    const handleRemove = (index: number) => {
        const newImages = [...images];

        newImages.splice(index, 1);
        formRestProps.setValue("photos", newImages);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = images.findIndex((item: any) => item.id === active.id);
            const newIndex = images.findIndex((item: any) => item.id === over?.id);

            const newImages = arrayMove(images, oldIndex, newIndex);

            formRestProps.setValue(
                "photos",
                newImages.map((item: any, index: number) => ({ ...item, sort: index })),
            );
        }
    };

    useEffect(() => {
        if (editGallery) {
            setEditGallery({ ...editGallery, photos: images });
        }
    }, [images]);

    return (
        <div className=" overflow-y-scroll h-[75vh] w-[70%] pl-4">
            <div className="mb-4">
                <FormFields.FileUpload
                    accept="image/*"
                    control={control}
                    defaultFiles={editGallery ? editGallery?.images : null}
                    full={true}
                    isPhotoGallery={true}
                    isPreview={false}
                    label=""
                    multiple={true}
                    name={`photos`}
                    {...formRestProps}
                />
            </div>
            {images && images.length > 0 && (
                <DndContext
                    collisionDetection={closestCenter}
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={images.map((item: any) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {images &&
                            images.map((field: any, index: number) => {
                                return (
                                    <Images
                                        key={index}
                                        control={control}
                                        currLang={currLang}
                                        editGallery={editGallery}
                                        field={field}
                                        formRestProps={formRestProps}
                                        handleRemove={handleRemove}
                                        index={index}
                                    />
                                );
                            })}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
