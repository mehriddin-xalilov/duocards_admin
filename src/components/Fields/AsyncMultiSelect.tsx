import { forwardRef, useEffect, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Props as ReactSelectProps, components } from "react-select";
import CreatableSelect from "react-select/creatable";

import { GetParams, ResponseDataType } from "@/services/api/types";

export type AsyncMultiSelectProps = ReactSelectProps & {
    name: string;
    params?: GetParams;
    optionValue: string | ((option: any) => any);
    optionLabel: string | ((option: any) => any);
    fetchFunction: <T>(params: GetParams) => Promise<ResponseDataType<T>>;
    defaultOptions?: any[];
    errorMessage?: string;
    isInvalid?: boolean;
    createFunction?: (input: string) => Promise<any>;
};

export const AsyncMultiSelect = forwardRef<any, AsyncMultiSelectProps>(
    (
        {
            name,
            params,
            fetchFunction,
            optionValue,
            optionLabel,
            defaultOptions = [],
            errorMessage,
            isInvalid,
            placeholder,
            createFunction,
            ...rest
        },
        ref,
    ) => {
        const [options, setOptions] = useState<any[]>(defaultOptions);

        const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
            queryKey: ["async-multi-select", name, params],
            queryFn: ({ pageParam = 1 }) =>
                fetchFunction({
                    page: pageParam,
                    per_page: 20,
                    sort: "-id",
                    ...params,
                }),
            getNextPageParam: ({ meta }) => {
                return meta?.total > meta?.current + 1 ? meta?.current + 1 : undefined;
            },
            initialPageParam: 1,
        });

        useEffect(() => {
            if (data?.pages) {
                const items = data.pages.flatMap((p) => p.data);

                setOptions(items);
            }
        }, [data]);

        const DropdownIndicator = (props: any) => {
            return (
                <components.DropdownIndicator {...props}>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            props.selectProps.menuIsOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 9l-7 7-7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                </components.DropdownIndicator>
            );
        };

        return (
            <div className="flex flex-col gap-1 w-full">
                <CreatableSelect
                    {...rest}
                    ref={ref}
                    className={`react-select-container bg-[#F4F4F5] rounded-medium !border-transparent relative z-40 ${isInvalid ? "border-red-500" : ""}`}
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                    components={{ DropdownIndicator }}
                    isLoading={isFetchingNextPage}
                    name={name}
                    options={options.map((opt: any) => ({
                        value:
                            typeof optionValue === "function" ? optionValue(opt) : opt[optionValue],
                        label:
                            typeof optionLabel === "function" ? optionLabel(opt) : opt[optionLabel],
                    }))}
                    placeholder={placeholder}
                    styles={{
                        control: (base, _) => ({
                            ...base,
                            backgroundColor: "#F4F4F5",
                            overflow: "hidden",
                            borderRadius: "8px",
                            borderColor: isInvalid ? "red" : "transparent",
                            boxShadow: "none",
                            "&:hover": {
                                borderColor: isInvalid ? "red" : "transparent",
                                backgroundColor: "#E3E3E5",
                            },
                            minHeight: "56px",
                        }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#2563eb", // tanlangan chip background
                            borderRadius: "6px",
                            padding: "2px 6px",
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: "white", // yozuv rangi
                            fontWeight: 500,
                        }),
                        multiValueRemove: (base, _) => ({
                            ...base,
                            color: "white",
                            cursor: "pointer",
                            ":hover": {
                                backgroundColor: "#1e40af", // hover qilinganda fon
                                color: "white",
                            },
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            borderRadius: "8px",
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                                ? "#2563eb"
                                : state.isFocused
                                  ? "#e0e7ff"
                                  : "white",
                            color: state.isSelected ? "white" : "black",
                            cursor: "pointer",
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: "#9CA3AF", // text-gray-400
                        }),
                    }}
                    onCreateOption={async (inputValue) => {
                        if (!inputValue) return;

                        try {
                            if (createFunction) {
                                // const existingValues = options.map((opt) =>
                                //     typeof optionValue === "function"
                                //         ? optionValue(opt)
                                //         : opt[optionValue],
                                // );

                                const res = await createFunction(inputValue);

                                const createdItems = Array.isArray(res.data)
                                    ? res.data
                                    : [res.data];

                                const refreshed = await fetchFunction({
                                    page: 1,
                                    per_page: 20,
                                    ...params,
                                });

                                setOptions(refreshed.data as any[]);

                                if (rest.onChange) {
                                    const prevValues = (rest.value as any[]) || [];

                                    // faqat yangilarini qo‘shamiz
                                    const newValues = [
                                        ...prevValues,
                                        ...createdItems
                                            .map((item: any) => ({
                                                value:
                                                    typeof optionValue === "function"
                                                        ? optionValue(item)
                                                        : item[optionValue],
                                                label:
                                                    typeof optionLabel === "function"
                                                        ? optionLabel(item)
                                                        : item[optionLabel],
                                            }))
                                            .filter(
                                                (nv: any) =>
                                                    !prevValues.some((pv) => pv.value === nv.value),
                                            ),
                                    ];

                                    rest.onChange(newValues, {
                                        action: "create-option",
                                        option: newValues[newValues.length - 1],
                                    } as any);
                                }
                            }
                        } catch (err) {
                            console.error("Create option error:", err);
                        }
                    }}
                    onMenuScrollToBottom={() => {
                        if (hasNextPage) fetchNextPage();
                    }}
                />
                {isInvalid && errorMessage && (
                    <span className="text-xs text-red-500">{errorMessage}</span>
                )}
            </div>
        );
    },
);

AsyncMultiSelect.displayName = "AsyncMultiSelect";
