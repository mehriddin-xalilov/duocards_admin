import { UseFormReturn } from "react-hook-form";

import { AsyncSelect, AsyncSelectProps } from "@/components/Fields/AsyncSelect";

type FormAsyncSelectProps = Omit<UseFormReturn, "handleSubmit"> & AsyncSelectProps;

export const FormAsyncSelect = (props: FormAsyncSelectProps) => {
    const { name, register, formState, defaultSelectedKeys, fetchFunction, ...rest } = props;

    const { errors } = formState || {};

    return (
        <AsyncSelect
            {...rest}
            {...register?.(name as string)}
            defaultSelectedKeys={defaultSelectedKeys}
            errorMessage={errors[name]?.message as string}
            fetchFunction={fetchFunction}
            isInvalid={!!errors[name]}
            name={name}
        />
    );
};
