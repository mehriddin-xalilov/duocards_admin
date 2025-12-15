import { forwardRef } from "react";

import { Switch as HerouiSwitch, SwitchProps as HerouiSwitchProps } from "@heroui/react";

export type SwitchProps = HerouiSwitchProps & {
    label: string;
    name: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
    const { name, label, ...rest } = props;

    return (
        <div className="flex items-center gap-2 w-full justify-between">
            <label className="text-sm font-medium" htmlFor={name}>
                {label}
            </label>

            <HerouiSwitch ref={ref} id={name} name={name} {...rest} />
        </div>
    );
});

Switch.displayName = "Switch";
