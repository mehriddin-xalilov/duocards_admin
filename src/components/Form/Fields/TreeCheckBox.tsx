import { useCallback, useEffect, useState } from "react";

import { Checkbox, Accordion, AccordionItem, ScrollShadow } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";

import { CategoriesItemType } from "@/services/api/categories.api";

type FormTreeCheckBoxProps = {
    control: UseFormReturn["control"];
    name: string;
    fetchFunction: () => Promise<any>;
    lang?: string;
};

type Category = CategoriesItemType & {
    [key: string]: any;
};

export const FormTreeCheckBox = ({
    control,
    name,
    fetchFunction,
    lang = "oz",
}: FormTreeCheckBoxProps) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const { data } = useQuery({
        queryKey: ["categories", lang],
        queryFn: () => fetchFunction(),
    });

    useEffect(() => {
        if (data) {
            setCategories(mapCategories(data.data));
        }
    }, [data]);

    const mapCategories = useCallback(
        (cats: any[]): Category[] => {
            return cats.filter((cate) => cate);
        },
        [data],
    );

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const checked = (id: number) => (field.value || []).includes(id);
                const toggle = (id: number, value: boolean) =>
                    value
                        ? field.onChange([...(field.value || []), id])
                        : field.onChange((field.value || []).filter((x: number) => x !== id));

                return (
                    <ScrollShadow
                        hideScrollBar
                        className="flex flex-col max-h-[300px] overflow-y-scroll"
                    >
                        {categories.map((cat) =>
                            cat.children?.length ? (
                                <Accordion key={cat.id} isCompact>
                                    <AccordionItem
                                        aria-label={cat.title}
                                        classNames={{
                                            trigger: "py-1",
                                        }}
                                        hideIndicator={false}
                                        textValue={cat[`title_${lang}`]}
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    className="p-0"
                                                    isSelected={checked(cat.id)}
                                                    radius="sm"
                                                    size="sm"
                                                    onValueChange={(v) => toggle(cat.id, v)}
                                                />
                                                <span className="text-sm">
                                                    {cat[`title_${lang}`]}
                                                </span>
                                            </div>
                                        }
                                    >
                                        <div className=" flex flex-col gap-1">
                                            {cat.children.map((child: any) => (
                                                <Checkbox
                                                    key={child.id}
                                                    isSelected={checked(child.id)}
                                                    radius="sm"
                                                    size="sm"
                                                    onValueChange={(v) => toggle(child.id, v)}
                                                >
                                                    {child[`title_${lang}`]}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Checkbox
                                    key={cat.id}
                                    classNames={{
                                        base: "block cursor-pointer px-0 py-1 m-0",
                                        hiddenInput: "h-fit",
                                    }}
                                    isSelected={checked(cat.id)}
                                    radius="sm"
                                    size="sm"
                                    title=""
                                    onValueChange={(v) => toggle(cat.id, v)}
                                >
                                    {cat[`title_${lang}`]}
                                </Checkbox>
                            ),
                        )}
                    </ScrollShadow>
                );
            }}
        />
    );
};
