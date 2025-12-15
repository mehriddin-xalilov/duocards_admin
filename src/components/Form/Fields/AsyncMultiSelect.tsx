import { Controller, UseFormReturn } from "react-hook-form";

import { AsyncMultiSelect, AsyncMultiSelectProps } from "@/components/Fields/AsyncMultiSelect";

type FormAsyncMultiSelectProps = Omit<UseFormReturn, "handleSubmit"> & AsyncMultiSelectProps;

export const FormAsyncMultiSelect = (props: FormAsyncMultiSelectProps) => {
    const { name, control, createFunction, placeholder, formState, fetchFunction, ...rest } = props;
    const { errors } = formState || {};

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <AsyncMultiSelect
                    {...rest}
                    {...field}
                    createFunction={createFunction}
                    errorMessage={errors[name]?.message as string}
                    fetchFunction={fetchFunction}
                    isInvalid={!!errors[name]}
                    name={name}
                    placeholder={placeholder}
                />
            )}
        />
    );
};
