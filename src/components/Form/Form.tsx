import { useEffect } from "react";

import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { FormProps, TData, TError } from "@/components/Form/types";
import { buildZodSchema } from "@/components/Form/validation";

export const Form = (props: FormProps) => {
    const {
        fetchFunction,
        fields,
        className,
        children,
        onSuccess = () => {},
        onError = () => {},
        ...rest
    } = props;

    const { mutate: formSubmit, isPending: isLoading } = useMutation<TData, TError, TData>({
        mutationFn: (data: TData) => {
            return fetchFunction(data);
        },
    });

    const onSubmit = (data: TData) => {
        fields.forEach((field) => {
            if (!field.isDisabled) {
                if (field.onSubmit) {
                    data[field.name] = field.onSubmit(data[field.name]);
                }
            }
        });

        try {
            formSubmit(data, {
                onSuccess: (response) => {
                    onSuccess(response as TData);
                },
                onError: (error) => {
                    addToast({
                        title: "Xatolik",
                        variant: "solid",
                        color: "danger",
                        description: error.response.data.message,
                    });

                    onError(error.response.data.message);
                },
            });
        } catch (error) {
            onError(error);
        }
    };

    const initialValues = fields.reduce(
        (acc, field) => ({
            ...acc,
            [field.name]: field.defaultValue,
        }),
        {} as Record<string, any>,
    );

    const { handleSubmit, watch, reset, control, ...restOfForm } = useForm({
        resolver: fields ? zodResolver(buildZodSchema(fields)) : undefined,
        mode: "onChange",
        defaultValues: initialValues,
        reValidateMode: "onChange",
    });

    useEffect(() => {
        reset(initialValues);
    }, [JSON.stringify(initialValues)]);

    const values = watch();

    useEffect(() => {
        props.onValuesChange?.(values);
    }, [values]);

    return (
        <form
            className={className}
            onSubmit={(e) => {
                e.stopPropagation(); // 🚫 eventni otaga yubormaydi
                handleSubmit(onSubmit)(e); // react-hook-form submit ishlaydi
            }}
            {...rest}
        >
            {children({
                watch,
                reset,
                control,
                ...restOfForm,
                getValues: restOfForm.getValues,
                isLoading,
            })}
        </form>
    );
};
