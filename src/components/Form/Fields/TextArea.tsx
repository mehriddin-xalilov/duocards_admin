import { UseFormReturn } from "react-hook-form";

import { Textarea, TextareaProps } from "@/components/Fields/TextArea";

type FormTextareaProps = Omit<UseFormReturn, "handleSubmit"> &
    TextareaProps & {
        name: string;
        editor?: boolean;
        placeholder?: string;
    };

export const FormTextarea = (props: FormTextareaProps) => {
    const { name, register, editor, placeholder, formState, ...rest } = props;

    const { errors } = formState || {};

    return (
        <Textarea
            {...rest}
            {...register?.(name)}
            editor={editor}
            errorMessage={errors[name]?.message as string}
            isInvalid={!!errors[name]}
            name={name}
            placeholder={placeholder}
        />
    );
};
