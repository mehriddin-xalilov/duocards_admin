// AsyncAutocomplete.tsx
import { forwardRef, useState, useCallback } from "react";

import {
    Autocomplete,
    AutocompleteItem,
    AutocompleteProps as AutocompletePropsHeroui,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { GetParams, ResponseDataType } from "@/services/api/types";

export type AsyncAutocompleteProps = Omit<AutocompletePropsHeroui, "children"> & {
    name: string;
    params?: GetParams;
    optionValue: string | ((option: any) => any);
    optionLabel: string | ((option: any) => any);
    fetchFunction: <T>(params: GetParams) => Promise<ResponseDataType<T>>;
    defaultItems?: any[];
};

export const AsyncAutocomplete = forwardRef<HTMLInputElement, AsyncAutocompleteProps>(
    (props, ref) => {
        const {
            name,
            params,
            fetchFunction,
            defaultItems = [],
            optionValue,
            optionLabel,
            ...rest
        } = props;

        const [search, setSearch] = useState("");

        const { data, isLoading } = useQuery<ResponseDataType<any[]>>({
            queryKey: ["async-autocomplete", name, search, params],
            queryFn: () =>
                fetchFunction<any[]>({
                    page: 1,
                    per_page: 15,
                    search,
                    ...params,
                }),
            enabled: Boolean(name),
        });
        const items = data?.data ?? [];

        const handleInputChange = useCallback((value: string) => {
            setSearch(value);
        }, []);

        return (
            <Autocomplete
                {...rest}
                ref={ref}
                defaultItems={defaultItems}
                isLoading={isLoading}
                name={name}
                onInputChange={handleInputChange}
            >
                {items?.map((option: any) => (
                    <AutocompleteItem
                        key={
                            typeof optionValue === "function"
                                ? optionValue(option)
                                : option[optionValue]
                        }
                        className="capitalize"
                        textValue={
                            typeof optionLabel === "function"
                                ? optionLabel(option)
                                : option[optionLabel]
                        }
                    >
                        {typeof optionLabel === "function"
                            ? optionLabel(option)
                            : option[optionLabel]}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        );
    },
);

AsyncAutocomplete.displayName = "AsyncAutocomplete";
