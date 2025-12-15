import { UseFormReturn } from "react-hook-form";

export type ValidationField = {
    name: string;
    validationType: "string" | "number" | "boolean" | "array" | "object" | "date" | "any";
    errorMessage?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    defaultValue?: string | number | boolean | object | any[];
    onSubmit?: (field: any) => any;
    // For array validation - specifies the type of array elements
    ofType?: "string" | "number" | "boolean" | "object";
    // For object validation - specifies nested fields
    fields?: ValidationField[];
    minLength?: number;
    maxLength?: number;
};

export type FormProps = {
    className?: string;
    fields: ValidationField[];
    fetchFunction: (data: Record<string, any>) => Promise<Record<string, any>>;
    onSuccess?: (data: Record<string, any>) => void;
    onError?: (error: any) => void;
    onValuesChange?: (values: Record<string, any>) => void;
    children: (
        props: Omit<UseFormReturn, "handleSubmit"> & { isLoading: boolean },
    ) => React.ReactNode;
};

export type TData = Record<string, any>;
export type TError = Error & {
    response: {
        data: {
            message: string;
        };
    };
};
