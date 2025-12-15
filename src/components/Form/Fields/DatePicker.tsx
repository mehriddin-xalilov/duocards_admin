import { UseFormReturn } from "react-hook-form";

import { DatePicker, DatePickerProps } from "@/components/Fields/DatePicker";
import { TimeInput } from "@heroui/react";
type FormDatePickerType = string;

type FormDatePickerProps = Omit<UseFormReturn, "handleSubmit"> & {
    name: string;
    type?: FormDatePickerType;
    granularity?: FormDatePickerType;
} & DatePickerProps;

export const FormDatePicker = (props: FormDatePickerProps) => {
    const { name, register, type = "date", granularity = "minute", formState, ...rest } = props;

    const { errors } = formState || {};
    const registration = register?.(name as string);

    if (type === "time") {
        return (
            <div className="flex flex-wrap gap-4">
                {/* @ts-ignore */}
                <TimeInput
                    {...rest}
                    ref={registration?.ref}
                    errorMessage={errors[name]?.message as string}
                    granularity="minute"
                    hourCycle={24}
                    isInvalid={!!errors[name]}
                    name={name}
                    onBlur={registration?.onBlur}
                    onChange={(value) => {
                        const event = {
                            target: { name, value },
                            type: "change",
                        };

                        registration?.onChange?.(event);
                    }}
                />
            </div>
        );
    }
    return (
        <DatePicker
            {...rest}
            ref={registration?.ref}
            errorMessage={errors[name]?.message as string}
            granularity={granularity}
            hourCycle={24}
            isInvalid={!!errors[name]}
            name={name}
            onBlur={registration?.onBlur}
            onChange={(value) => {
                const event = {
                    target: { name, value },
                    type: "change",
                };

                registration?.onChange?.(event);
            }}
        />
    );
};
