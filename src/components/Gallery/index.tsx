import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { Edit, Trash } from "lucide-react";

import GalleryModal from "./GalleryModal";
import { galleryApi, GalleryType } from "@/services/api/gallery.api";
import { useSearch } from "@tanstack/react-router";

type GallerySelectProps = {
    setValue: any;
    watch?: any;
};

export default function GallerySelect({ setValue, watch }: GallerySelectProps) {
    const search = useSearch({ from: "/_main" });
    const { lang } = search;

    const [galleries, setGalleries] = useState([{ id: "add_new", name: "➕ Qo‘shish" }]);
    const [open, setOpen] = useState(false);

    const [selected, setSelected] = useState<string[]>([]);

    const [editGallery, setEditGallery] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchGalleries = async () => {
        try {
            const res = await galleryApi.getGalleries<GalleryType[]>({ sort: "-id" });

            if (res?.data) {
                const options = res.data.map((g: any) => {
                    let name = g.name;
                    if (typeof name === "object") name = name[lang];
                    return { id: String(g.id), name: name || "" };
                });

                setGalleries([{ id: "add_new", name: "➕ Qo‘shish" }, ...options]);
            }
        } catch (err) {
            console.error("Galereyalarni olishda xato:", err);
        }
    };

    const handleSelect = (keys: Set<string>) => {
        const selectedArr = Array.from(keys);

        if (selectedArr.includes("add_new")) {
            setOpen(false);
            setIsOpen(true);
            return;
        }

        setSelected(selectedArr);
        setValue("items", selectedArr.join(","), { shouldValidate: true });
    };

    const handleEdit = async (id: string) => {
        try {
            const res = await galleryApi.getGallery(Number(id));
            if (res?.data) {
                setEditGallery(res.data);
                setIsOpen(true);
            }
        } catch (err) {
            console.error("Gallery ma’lumotini olishda xato:", err);
        }
    };

    const handleDeleteSelected = (id: string) => {
        const updated = selected.filter((item) => item !== id);
        console.log(updated);
        setSelected(updated);
        setValue("items", updated, { shouldValidate: true });
    };

    useEffect(() => {
        fetchGalleries();
    }, []);

    useEffect(() => {
        if (!isOpen) setEditGallery(null);
    }, [isOpen]);
    useEffect(() => {
        const defaultItems = watch;

        if (Array.isArray(defaultItems) && defaultItems.length > 0) {
            const ids = defaultItems.map((item: any) => String(item.id));

            setSelected(ids);
            setValue("items", ids.join(","), { shouldValidate: true });
        }
    }, []);

    console.log(selected);
    return (
        <>
            <Select
                label="Fotogallereyalar"
                selectionMode="multiple"
                selectedKeys={new Set(selected)}
                onSelectionChange={(keys) => handleSelect(keys as Set<string>)}
                isOpen={open}
                onOpenChange={setOpen}
                className="w-full"
                placeholder="Tanlang..."
            >
                {galleries.map((item) => (
                    <SelectItem
                        key={item.id}
                        className={item.id === "add_new" ? "text-primary font-semibold" : ""}
                    >
                        {item.name}
                    </SelectItem>
                ))}
            </Select>

            {selected.length > 0 && (
                <div className="flex flex-col gap-2 mt-3 h-[300px] overflow-y-scroll">
                    {selected.map((id) => {
                        const item = galleries.find((g) => g.id === id);
                        if (!item) return null;

                        return (
                            <div
                                key={id}
                                className="p-3 bg-gray-100 rounded-lg flex justify-between items-center flex-col gap-3"
                            >
                                <span>{item.name}</span>

                                <div className="flex gap-2">
                                    <Button onPress={() => handleEdit(id)}>
                                        <Edit width={15} />
                                    </Button>

                                    <Button color="danger" onPress={() => handleDeleteSelected(id)}>
                                        <Trash width={15} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <GalleryModal
                fetchGalleries={fetchGalleries}
                editGallery={editGallery}
                isOpen={isOpen}
                setSelected={setSelected}
                setEditGallery={setEditGallery}
                setIsOpen={setIsOpen}
                onSuccess={async () => {
                    setIsOpen(false);
                    setEditGallery(null);
                    await fetchGalleries();
                }}
            />
        </>
    );
}
