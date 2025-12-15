import { forwardRef } from "react";

import {
    Select as SelectHeroui,
    SelectItem,
    SelectProps as SelectPropsHeroui,
} from "@heroui/react";

export type SelectProps = Omit<SelectPropsHeroui, "children"> & {
    name: string;
    options: { label: string; value: string | number }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    const { options, ...rest } = props;

    return (
        <SelectHeroui ref={ref} {...rest}>
            {options?.map((option) => <SelectItem key={option.value}>{option.label}</SelectItem>)}
        </SelectHeroui>
    );
});

Select.displayName = "Select";
