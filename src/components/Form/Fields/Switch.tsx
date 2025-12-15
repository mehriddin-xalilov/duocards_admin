import { UseFormReturn } from "react-hook-form";

import { Switch, SwitchProps } from "@/components/Fields/Switch";

type FormSwitchProps = Omit<UseFormReturn, "handleSubmit"> & SwitchProps;

export const FormSwitch = (props: FormSwitchProps) => {
    const { name, label, register, setValue, onChange, isSelected, isDisabled } = props;

    return (
        <div className="flex items-center gap-2">
            <Switch
                {...register?.(name as string)}
                id={name}
                isDisabled={isDisabled}
                isSelected={isSelected}
                label={label}
                name={name}
                onChange={(e) => {
                    setValue(name, e.target.checked);
                    if (onChange) {
                        onChange(e);
                    }
                }}
            />
        </div>
    );
};
