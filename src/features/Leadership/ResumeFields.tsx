import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/react";

export const ResumeFields = ({ name, defaultValue = [], setValue }: any) => {
    const generateId = () => Date.now() + Math.random();

    // default value ichiga id qo‘shish
    const normalizeItems = (items: any[]) =>
        items.map((item) => ({
            id: item.id || generateId(),
            title: item.title || "",
            description: item.description || "",
        }));

    const [items, setItems] = useState(normalizeItems(defaultValue));

    useEffect(() => {
        setValue(name, items);
    }, [items]);

    const addItem = () => {
        setItems([
            ...items,
            {
                id: generateId(),
                title: "",
                description: "",
            },
        ]);
    };

    const removeItem = (id: any) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateItem = (id: any, key: any, value: any) => {
        setItems(items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">Resume</div>
                <Button color="primary" variant="flat" onPress={addItem} className="mb-3">
                    + Resume
                </Button>
            </div>
            <div className="flex flex-col overflow-y-scroll h-[300px]">
                {items.map((item: any, i: any) => (
                    <div
                        key={item.id}
                        className="not-last:mb-3 border border-gray-400 border-dashed rounded-2xl p-4"
                    >
                        <div className="flex gap-3">
                            <Textarea
                                label="Faoliyat tavsifi"
                                className="w-[70%]"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            />
                            <Input
                                label="Yil"
                                value={item.title}
                                className="mb-3  w-[30%]"
                                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                            />
                        </div>
                        {i !== 0 && (
                            <Button
                                color="danger"
                                className="mt-3"
                                onPress={() => removeItem(item.id)}
                            >
                                O‘chirish
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
