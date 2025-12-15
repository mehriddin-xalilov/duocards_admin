import { useState, useMemo, useCallback } from "react";

import { Button, DateRangePicker, Input, Select, SelectItem, Switch } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";

import { CategoriesApi, CategoriesItemType } from "@/services/api/categories.api";

export function Filters() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [clearKey, setClearKey] = useState(false);

    const { data, isFetching } = useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoriesApi.getCategories<CategoriesItemType[]>({ per_page: 1000 }),
    });

    const handleClear = () => {
        navigate({
            search: {
                lang: (search as any).lang,
                search: "",
                categories: "",
                start: "",
                end: "",
                viewed: false,
            } as any,
        });
        setClearKey(!clearKey);
    };

    const handleChange = useCallback(
        debounce((key: string, value: string | object | boolean) => {
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
        }, 500),
        [search],
    );

    const showClearButton = useMemo(() => {
        const hasSearch = Boolean(search.search);
        const hasCategories = Boolean(search.categories);
        const hasDate = Boolean(search.date?.start || search.date?.end);

        return hasSearch || hasCategories || hasDate;
    }, [search]);

    return (
        <div className="flex items-center gap-2 w-full">
            <Input
                key={String(clearKey)}
                className="flex-1"
                defaultValue={search.search ?? ""}
                endContent={<SearchIcon size={16} />}
                placeholder="Qidirish (sarlavha)"
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <Select
                className="flex-1"
                isLoading={isFetching}
                items={data?.data ?? []}
                placeholder="Kategoriyalar"
                selectedKeys={(search.categories ?? "").split(",")}
                selectionMode="multiple"
                onChange={(e) => handleChange("categories", e.target.value)}
            >
                {(item: CategoriesItemType) => (
                    <SelectItem key={item.id}>
                        {/* {item[`title_${search.lang}` as keyof CategoriesItemType]} */}
                    </SelectItem>
                )}
            </Select>

            <I18nProvider locale="en-GB">
                <DateRangePicker
                    key={String(clearKey)}
                    className="flex-1"
                    onChange={(e) =>
                        handleChange("date", {
                            start: dayjs(e?.start.toDate("UTC")).format("DD-MM-YYYY"),
                            end: dayjs(e?.end.toDate("UTC")).format("DD-MM-YYYY"),
                        })
                    }
                />
            </I18nProvider>
            <Switch onChange={(e) => handleChange("viewed", e.target.checked)}>
                Ko'p o'qilganlar
            </Switch>
            <AnimatePresence mode="wait">
                {showClearButton && (
                    <motion.div
                        key="clear-btn"
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Button color="danger" variant="flat" onPress={handleClear}>
                            Tozalash
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
