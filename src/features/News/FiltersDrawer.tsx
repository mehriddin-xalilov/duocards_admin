import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { DateRangePicker, Input, Select, SelectItem } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { SearchIcon } from "lucide-react";

import { CategoriesApi, CategoriesItemType } from "@/services/api/categories.api";
import { debounce } from "@/services/helpers";

interface FiltersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FiltersDrawer({ isOpen, onClose }: FiltersDrawerProps) {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { data, isFetching } = useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoriesApi.getCategories<CategoriesItemType[]>({ per_page: 1000 }),
    });

    const handleChange = debounce((key: string, value: string | object) => {
        if (typeof value === "object") {
            navigate({
                search: {
                    ...search,
                    ...value,
                },
            });
        } else {
            navigate({
                search: {
                    ...search,
                    [key]: value,
                },
            });
        }
    }, 500);

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>Saralash</DrawerHeader>
                <DrawerBody>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            className="col-span-2"
                            defaultValue={search.search ?? ""}
                            endContent={<SearchIcon size={16} />}
                            placeholder="Qidirish (sarlovha, id)"
                            onChange={(e) => handleChange("search", e.target.value)}
                        />
                        <Select
                            className="col-span-1"
                            isLoading={isFetching}
                            items={data?.data ?? []}
                            placeholder="Kategoriyalar"
                            selectionMode="multiple"
                            onChange={(e) => handleChange("categories", e.target.value)}
                        >
                            {(item: CategoriesItemType) => (
                                <SelectItem key={item.id}>
                                    {/* {item[`title_${search.lang}` as keyof CategoriesItemType]} */}
                                </SelectItem>
                            )}
                        </Select>
                        <Select
                            className="col-span-1"
                            placeholder="Status bo'yicha"
                            onChange={(e) => handleChange("status", e.target.value)}
                        >
                            <SelectItem key={"1"}>Aktiv</SelectItem>
                            <SelectItem key={"0"}>Deaktiv</SelectItem>
                        </Select>
                        <I18nProvider locale="en-GB">
                            <DateRangePicker
                                className="col-span-2"
                                placeholderValue={search.date ?? ""}
                                onChange={(e) =>
                                    handleChange("date", {
                                        start: dayjs(e?.start.toDate("UTC")).format("DD-MM-YYYY"),
                                        end: dayjs(e?.end.toDate("UTC")).format("DD-MM-YYYY"),
                                    })
                                }
                            />
                        </I18nProvider>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
