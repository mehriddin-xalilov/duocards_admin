import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { GripVertical, Trash } from "lucide-react";

import { FormFields } from "../Form";

export default function Images(props: any) {
    const { field, control, index, currLang, formRestProps, handleRemove, editGallery } = props;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: field.id,
    });

    console.log(field, "editGallery");

    return (
        <div
            key={field.id}
            ref={setNodeRef}
            className={cn(
                `${isDragging ? "opacity-50" : ""} `,
                "flex flex-col gap-4 w-[100%] border-gray-300 border-solid mb-4",
            )}
            style={{ transform: CSS.Transform.toString(transform), transition }}
        >
            <div className="flex items-center justify-between shadow-lg gap-3 border border-gray-100 bg-[#fdfdfd] border-solid p-4 rounded-xl">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing"
                    title="Rasmni ko‘chirish"
                    type="button"
                >
                    <GripVertical size={18} />
                </button>

                <div className="w-[40%] bg-[#F4F4F5] h-[170px] rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                        alt="upload"
                        className="h-full "
                        src={
                            !editGallery
                                ? field?.thumbnails?.normal?.src
                                : field?.photo
                                  ? field?.photo?.thumbnails?.normal?.src
                                  : field.thumbnails?.normal?.src
                        }
                    />
                </div>
                <div className="w-[60%] h-[-webkit-fill-available] flex flex-col">
                    {currLang === "uz" && (
                        <FormFields.Textarea
                            control={control}
                            label="Rasm tavsifi"
                            name={`photos.${index}.name_${currLang}`}
                            radius="sm"
                            type="text"
                            defaultValue={field && field?.name ? field?.name?.uz : ""}
                            {...formRestProps}
                        />
                    )}

                    {currLang === "ru" && (
                        <FormFields.Textarea
                            control={control}
                            label="Rasm tavsifi"
                            name={`photos.${index}.name_${currLang}`}
                            radius="sm"
                            type="text"
                            defaultValue={field && field?.name ? field?.name?.ru : ""}
                            {...formRestProps}
                        />
                    )}

                    <Button className="bg-red-300 mt-auto" onPress={() => handleRemove(index)}>
                        O&apos;chirish <Trash width={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
