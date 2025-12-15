import { UseFormReturn } from "react-hook-form";

import { Input, InputProps } from "@/components/Fields/Input";

type FormInputProps = Omit<UseFormReturn, "handleSubmit"> &
    InputProps & {
        name: string;
        className?: string;
        editor?: boolean;
        placeholder?: string;
    };

export const FormInput = (props: FormInputProps) => {
    const { name, register, placeholder, className, editor, formState, ...rest } = props;

    const { errors } = formState || {};

    return (
        <Input
            {...rest}
            {...register?.(name as string)}
            className={className}
            editor={editor}
            errorMessage={errors[name]?.message as string}
            isInvalid={!!errors[name]}
            name={name}
            placeholder={placeholder}
        />
    );
};
