import { forwardRef, useState } from "react";

import { Select, SelectProps as AsyncSelectPropsHeroui, SelectItem } from "@heroui/react";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { GetParams, ResponseDataType } from "@/services/api/types";

export type AsyncSelectProps = Omit<AsyncSelectPropsHeroui, "children"> & {
    name: string;
    params?: GetParams;
    optionValue: string | ((option: any) => any);
    optionLabel: string | ((option: any) => any);
    fetchFunction: <T>(params: GetParams) => Promise<ResponseDataType<T>>;
    defaultSelectedKeys?: any;
    defaultOptions?: [];
    queryKey?: string[];
};

export const AsyncSelect = forwardRef<HTMLSelectElement, AsyncSelectProps>((props, ref) => {
    const {
        name,
        params,
        fetchFunction,
        defaultSelectedKeys,
        defaultOptions = [],
        optionValue,
        optionLabel,
        selectionMode,

        ...rest
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["async-select", name, params],
        queryFn: ({ pageParam = 1 }) =>
            fetchFunction({
                page: pageParam,
                per_page: 15,
                ...params,
            }),
        getNextPageParam: ({ meta }) => {
            return meta?.total > meta?.current + 1 ? meta?.current + 1 : null;
        },
        enabled: Boolean(name),
        initialPageParam: 1,
    });

    const { pages = [] } = (data as InfiniteData<ResponseDataType<any[]>>) || {};

    const items = pages.flatMap((page) => page.data);
    const mergedItems =
        selectionMode === "single"
            ? items
            : [...defaultOptions, ...items].filter(
                  (v, i, arr) => arr.findIndex((o) => o.id === v.id) === i,
              );

    const [, scrollRef] = useInfiniteScroll({
        hasMore: Boolean(hasNextPage),
        isEnabled: Boolean(hasNextPage),
        shouldUseLoader: false,
        onLoadMore: () => fetchNextPage(),
    });

    return (
        <Select
            {...rest}
            ref={ref}
            defaultSelectedKeys={defaultSelectedKeys}
            isLoading={isFetchingNextPage}
            items={isOpen ? items : []}
            name={name}
            scrollRef={scrollRef}
            selectionMode={selectionMode}
            onOpenChange={setIsOpen}
        >
            {mergedItems?.map((option: any) => (
                <SelectItem
                    key={
                        typeof optionValue === "function"
                            ? optionValue(option)
                            : option[optionValue]
                    }
                    className="capitalize"
                >
                    {typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel]}
                </SelectItem>
            ))}
        </Select>
    );
});

AsyncSelect.displayName = "AsyncSelect";
