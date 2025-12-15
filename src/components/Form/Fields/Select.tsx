import { UseFormReturn } from "react-hook-form";

import { Select, SelectProps } from "@/components/Fields/Select";

type FormSelectProps = Omit<UseFormReturn, "handleSubmit"> & Omit<SelectProps, "children">;

export const FormSelect = (props: FormSelectProps) => {
    const { name, disabled, register, formState, ...rest } = props;
    const { errors } = formState || {};

    return (
        <Select
            {...rest}
            {...register?.(name as string)}
            disabled={disabled}
            errorMessage={errors[name]?.message as string}
            isInvalid={!!errors[name]}
            name={name}
        />
    );
};
