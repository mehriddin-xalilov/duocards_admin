import { RadioGroup, Radio } from "@heroui/react";
import { UseFormReturn, Controller } from "react-hook-form";

export type RadioOption = {
    label: string;
    value: string | number;
};

type FormRadioGroupProps = Omit<UseFormReturn, "handleSubmit"> & {
    name: string;
    options: RadioOption[];
    orientation?: "horizontal" | "vertical";
    label?: string;
    defaultValue?: string | number;
};

export const FormRadioGroup = (props: FormRadioGroupProps) => {
    const {
        name,
        control,
        formState,
        options,
        orientation = "vertical",
        label,
        defaultValue,
    } = props;
    const { errors } = formState || {};

    return (
        <Controller
            control={control}
            defaultValue={defaultValue ?? ""}
            name={name}
            render={({ field }) => (
                <RadioGroup
                    errorMessage={errors[name]?.message as string}
                    isInvalid={!!errors[name]}
                    label={label}
                    orientation={orientation}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                >
                    <div className="grid grid-cols-2 gap-2">
                        {options?.map((option) => (
                            <Radio key={option.value} value={String(option.value)}>
                                {option.label}
                            </Radio>
                        ))}
                    </div>
                </RadioGroup>
            )}
        />
    );
};
