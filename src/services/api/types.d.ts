export type Meta = {
    total_pages: number;
    current: number;
    perPage: number;
    next: number;
    previous: null;
    total: number;
    totalItems: number;
};

export type ResponseDataType<T> = {
    data: T;
    message: string;
    status_code: number;
    meta: Meta;
    _l?: string;
};

export type GetParams = {
    page?: number;
    per_page?: number;
    lang?: string;
    include?: string;
    categories?: "";
    title?: string;
    author?: string;
    description?: string;
    ext?: string;

    menu_id?: id;
    sort?: string | string[];
    search?: string;
    extra?: {
        [key: string]: any;
    };
    filter?: {
        [key: string]: any;
    };
    _l?: string;
};
