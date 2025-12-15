import { Controller, UseFormReturn } from "react-hook-form";

import { AsyncAutocomplete, AsyncAutocompleteProps } from "@/components/Fields/AsyncAutocomplete";

type FormAsyncAutocompleteProps = {
    control: UseFormReturn["control"];
    name: string;
} & Omit<AsyncAutocompleteProps, "name">;

export const FormAsyncAutocomplete = (props: FormAsyncAutocompleteProps) => {
    const { control, name, ...rest } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <AsyncAutocomplete
                    {...rest}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    name={name}
                    // react-hook-form bilan ulash
                    selectedKey={field.value ?? null}
                    onSelectionChange={(key) => field.onChange(key)}
                />
            )}
        />
    );
};
