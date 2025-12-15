import { useEffect, useMemo, useState } from "react";

import { Pagination } from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    AllCommunityModule,
    IToolPanel,
    ModuleRegistry,
    themeQuartz,
    ValidationModule,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";

import { GetParams, ResponseDataType } from "@/services/api/types";
const localeTextUz = {
    sortAscending: "O'sish tartibida saralash",
    sortDescending: "Kamayish tartibida saralash",

    // Pin
    pinColumn: "Ustunni mahkamlash",
    pinLeft: "Chapga mahkamlash",
    pinRight: "O‘ngga mahkamlash",
    noPin: "Mahkamlashni olib tashlash",

    // Column sizing
    autosizeThisColumn: "Ustunni moslash",
    autosizeAllColumns: "Barcha ustunlarni moslash",

    // Column chooser
    chooseColumns: "Ustunlarni tanlash",
    resetColumns: "Ustunlarni tiklash",

    // Filtering & other
    applyFilter: "Filtrni qo‘llash",
    equals: "Teng",
    notEqual: "Teng emas",
    contains: "O‘z ichiga oladi",
    notContains: "O‘z ichiga olmaydi",
    startsWith: "Bilan boshlanadi",
    endsWith: "Bilan tugaydi",
};

ModuleRegistry.registerModules([
    AllCommunityModule,
    AllEnterpriseModule,
    ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

type QuartzThemeParams = Parameters<typeof themeQuartz.withParams>[0];

interface AgGridTableProps<T> extends AgGridReactProps {
    gridRef?: React.RefObject<AgGridReact>;
    fetchData: (params: GetParams) => Promise<ResponseDataType<T[]>>;
    params: GetParams;
    queryKey: string | string[];
    styles?: QuartzThemeParams;
    onDataLoaded?: (data: T[]) => void;
    filters?: string | IToolPanel;
}

const AgGridTable = <T,>(initialProps: AgGridTableProps<T>) => {
    const {
        gridRef,
        fetchData,
        pagination = false,
        queryKey,
        params: initialParams,
        styles = {},
        onDataLoaded,
        filters,
        ...props
    } = initialProps;
    const myTheme = themeQuartz.withParams(styles);

    const [params, setParams] = useState<GetParams>({
        page: 1,
        per_page: 20,
        ...initialParams,
    });

    const { data, isFetching } = useQuery({
        queryKey: [queryKey, params],
        queryFn: () => fetchData(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
    useEffect(() => {
        if (data?.data && onDataLoaded) {
            initialProps.onDataLoaded?.(data.data);
        }
    }, [data]);

    const handlePaginationChanged = (page: number) => {
        setParams((prev) => ({
            ...prev,
            page,
        }));
    };

    const sideBar = useMemo(() => {
        return {
            toolPanels: [
                {
                    id: "columns",
                    labelDefault: "Kolumnalar",
                    labelKey: "columns",
                    iconKey: "columns",
                    toolPanel: "agColumnsToolPanel",
                },
                {
                    id: "custom-filter",
                    labelDefault: "Filtrlash",
                    labelKey: "custom-filter",
                    iconKey: "filter",
                    toolPanel: filters ?? "agFiltersToolPanel",
                    toolPanelParams: {
                        minWidth: 900,
                        maxWidth: 900,
                    },
                },
            ],
        };
    }, [filters]);

    useEffect(() => {
        // Clear bo'lganda initialParams faqat lang bilan keladi
        // Shunda prev ishlatilmaydi
        if (Object.keys(initialParams).length <= 2 && initialParams.lang && initialParams._l) {
            setParams({
                page: 1,
                per_page: 20,
                ...initialParams,
            });
        } else {
            setParams((prev) => ({
                ...prev,
                ...initialParams,
            }));
        }
    }, [initialParams]);

    return (
        <div className="h-full flex flex-col gap-4">
            <AgGridReact
                ref={gridRef}
                loading={isFetching}
                localeText={localeTextUz}
                rowData={data?.data}
                sideBar={sideBar}
                theme={myTheme}
                {...props}
            />
            {pagination && (
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    className="self-end"
                    initialPage={params.page}
                    isDisabled={isFetching}
                    total={data?.meta.total ?? 1}
                    onChange={handlePaginationChanged}
                />
            )}
        </div>
    );
};

export default AgGridTable;
