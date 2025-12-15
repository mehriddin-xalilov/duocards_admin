import { Pagination } from "@heroui/react";

type TablePaginationProps = {
    current_page: number;
    total_pages: number;
    setPage: (page: number) => void;
};

export const TablePagination = (props: TablePaginationProps) => {
    const { current_page, total_pages, setPage } = props;

    return (
        <Pagination
            showControls
            showShadow
            className="mx-auto"
            page={current_page}
            total={total_pages}
            onChange={(page) => setPage(page as number)}
        />
    );
};
