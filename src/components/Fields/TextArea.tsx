import { forwardRef, useEffect, useRef } from "react";

import { Textarea as TextareaHeroui, TextAreaProps as TextareaPropsHeroui } from "@heroui/react";
import { Controller, Control } from "react-hook-form";

export type TextareaProps = TextareaPropsHeroui & {
    name: string;
    control: Control<any>;
    errorMessage?: string;
    editor?: boolean;
    placeholder?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ name, control, editor, placeholder, errorMessage, ...rest }, ref) => {
        const innerRef = useRef<HTMLTextAreaElement | null>(null);

        const setHeight = (el: HTMLTextAreaElement | null) => {
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        };

        useEffect(() => {
            setHeight(innerRef.current);
        }, [innerRef.current]);

        return (
            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => {
                    if (editor) {
                        // set ref to innerRef
                        const combinedRef = (el: HTMLTextAreaElement) => {
                            innerRef.current = el;
                            if (typeof ref === "function") ref(el);
                            else if (ref) ref.current = el;
                        };

                        return (
                            <textarea
                                {...field}
                                ref={combinedRef}
                                className={`w-full resize-none overflow-hidden bg-transparent focus:outline-none ${
                                    name === "title"
                                        ? "text-[40px] font-semibold"
                                        : "text-[25px] font-medium"
                                }`}
                                placeholder={placeholder}
                                rows={1}
                                onInput={(e) => {
                                    const target = e.currentTarget;

                                    setHeight(target);
                                    field.onChange(e);
                                }}
                            />
                        );
                    }

                    return (
                        <TextareaHeroui
                            {...rest}
                            {...field}
                            ref={ref}
                            errorMessage={fieldState.error?.message || errorMessage}
                            isInvalid={!!fieldState.error}
                            name={name}
                        />
                    );
                }}
            />
        );
    },
);

Textarea.displayName = "Textarea";
