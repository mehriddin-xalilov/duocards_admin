import { useState } from "react";

import {
    TableColumn,
    Table as HerouiTable,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Spinner,
    Button,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Eye, Pencil, Trash } from "lucide-react";

import { TableHeading, TablePagination } from "@/components/Table";
import { TableProps } from "@/components/Table/types";

import { ResponseDataType } from "@/services/api/types";

const LoadingContent = () => {
    return <Spinner className="w-full h-full bg-white/50 z-[21]" variant="gradient" />;
};

const EmptyContent = () => {
    return <div>{`Ma'lumot topilmadi`}</div>;
};

export const Table = <T,>(props: TableProps<T>) => {
    const {
        name,
        className,
        columns,
        params,
        fetchFunction,
        perPage = 10,
        title,
        description,
        createButton,
        filter,
        tabs,
    } = props;

    const search = useSearch({ from: `/_main/${name}` });

    const searchQuery = search.search;

    const searchParams = { ...search };

    delete searchParams.search;

    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: [name, page, searchParams, searchQuery],
        queryFn: () =>
            fetchFunction({
                page,
                per_page: perPage,
                ...params,
                search: searchQuery,
                // filter: {
                //     ...searchParams,
                // },
            }),
        enabled: Boolean(name),
    });

    const { data: rowData = [], meta } = (data as ResponseDataType<T[]>) || {};

    const { current: current_page, total: total_pages } = meta || {};

    return (
        <HerouiTable
            isHeaderSticky
            isVirtualized
            aria-label={name}
            bottomContent={
                <TablePagination
                    current_page={current_page}
                    setPage={setPage}
                    total_pages={total_pages}
                />
            }
            bottomContentPlacement="outside"
            className={`${className} h-full [&>div:nth-child(2)]:!h-full whitespace-nowrap`}
            selectionMode="single"
            spellCheck={false}
            topContent={
                <TableHeading
                    createButton={createButton}
                    description={description}
                    filter={filter}
                    tabs={tabs}
                    title={title}
                />
            }
            topContentPlacement="outside"
            onRowAction={() => {}}
        >
            <TableHeader>
                {columns.map((column) => {
                    return (
                        <TableColumn {...column} key={column.key}>
                            {column.label}
                        </TableColumn>
                    );
                })}
            </TableHeader>

            <TableBody
                emptyContent={<EmptyContent />}
                isLoading={isFetching}
                loadingContent={<LoadingContent />}
            >
                {(rowData || []).map((item: any) => (
                    <TableRow key={item.id}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                                    {column.render
                                        ? column.render(item)
                                        : getKeyValue(item, column.key)}

                                    {column.onEdit || column.onDelete || column.onView ? (
                                        <div className="flex gap-2">
                                            {column.onView && (
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => column.onView!(item)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            )}
                                            {column.onEdit && (
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    isDisabled={
                                                        column.isDisabled
                                                            ? column.isDisabled(item)
                                                            : false
                                                    }
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => column.onEdit!(item)}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                            )}
                                            {column.onDelete && (
                                                <Button
                                                    isIconOnly
                                                    color="danger"
                                                    isDisabled={
                                                        column.isDisabled
                                                            ? column.isDisabled(item)
                                                            : false
                                                    }
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => column.onDelete?.(item)}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </HerouiTable>
    );
};
