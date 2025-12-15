import { GetParams, ResponseDataType } from "@/services/api/types";

export type TableProps<T> = {
    name: string;
    className?: string;
    perPage?: number;
    params?: GetParams;

    columns: {
        key: string;
        label: string;
        isDisabled?: (value: T) => boolean;
        onEdit?: (value: T) => void;
        onDelete?: (value: T) => void;
        onView?: (value: T) => void;
        render?: (value: T) => React.ReactNode;
    }[];
    filter?: React.ReactNode;
    title?: string;
    _l?: string;
    description?: string;
    tabs?: React.ReactNode;
    createButton?: {
        title?: string;
        onPress: () => void;
    };
    fetchFunction: <T>(params: GetParams) => Promise<ResponseDataType<T>>;
};
