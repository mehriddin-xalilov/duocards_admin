import { forwardRef, useState } from "react";

import { Button } from "@heroui/button";
import { Input as InputHeroui, InputProps as InputPropsHeroui } from "@heroui/input";
import { Eye } from "lucide-react";

export type InputProps = InputPropsHeroui & {
    name: string;
    formatPrice?: boolean;
    className?: string;
    editor?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { name, className, type, ...rest } = props;

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <InputHeroui
            ref={ref}
            {...rest}
            className={className}
            endContent={
                type === "password" ? (
                    <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        variant="light"
                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                    >
                        <Eye />
                    </Button>
                ) : null
            }
            name={name}
            type={type === "password" ? (isPasswordVisible ? "text" : "password") : type}
        />
    );
});

Input.displayName = "Input";
