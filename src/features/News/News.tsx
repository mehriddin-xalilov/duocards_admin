import { useMemo, useState } from "react";

import { addToast, Button, Chip, Switch } from "@heroui/react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import dayjs from "dayjs";
import { Plus, Trash, Copy, Pencil, Eye } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { Filters, TabComponent } from "@/features/News";
import { useUser } from "@/hooks/useUser";
import { CategoriesItemType } from "@/services/api/categories.api";
import { NewsItemType, newsApi } from "@/services/api/news.api";
import { userApi } from "@/services/api/user.api";

export const News = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const navigate = useNavigate({ from: "/posts" });
    const [tabLang, setTabLang] = useState("oz");
    const searchParams = useSearch({ from: "/_main" });
    const { user } = useUser();
    const role = user?.user_role?.role;
    const [newsModal, setNewsModal] = useState<{
        open: boolean;
        news?: NewsItemType;
        lang_hash?: string;
    }>({ open: false });

    useInfiniteQuery({
        queryKey: ["async-select", "author_id", { _l: tabLang, per_page: 1000 }],
        queryFn: ({ pageParam = 1 }) =>
            userApi.getUsers({ page: pageParam, per_page: 1000, _l: tabLang }),
        getNextPageParam: ({ meta }) => {
            return meta?.total > meta?.current + 1 ? meta?.current + 1 : null;
        },
        initialPageParam: 1,
    });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => newsApi.deleteNews(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            addToast({
                title: "Yangilik iqtibosi muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteNew = (id: number) => {
        deleteById(id);
    };

    const handleDelete = (item: NewsItemType) => {
        setIsConfirmModalOpen(true);
        setNewsModal({ open: false, news: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        newsApi.updateNews(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["posts"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">ID</p>
                ),
                width: 60,
                suppressMenu: true,
                cellClass: "!flex items-center justify-center",
            },
            {
                field: "photo",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">Rasm</p>
                ),
                width: 120,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={
                                params.data.photo?.thumbnails?.small?.src ||
                                params.data.photo?.small
                            }
                        />
                    );
                },
            },
            {
                field: "title",
                headerName: "Yangilik sarlavhasi",
                onCellClicked: ({ data }) => {
                    navigate({
                        to: `/news/update/${data.id}?lang=${tabLang}`,
                    });
                },
                flex: 2,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div
                            className="cursor-pointer line-clamp-2 text-ellipsis overflow-hidden leading-snug"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                maxHeight: "2.8em",
                                whiteSpace: "normal",
                            }}
                            title={params.value}
                            onClick={() =>
                                navigate({
                                    to: `/news/update/${params.data.id}?lang=${tabLang}`,
                                })
                            }
                        >
                            {params.value}
                        </div>
                    );
                },
            },
            {
                field: "short_slug",
                headerName: "Short slug",
                flex: 1,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex items-center gap-2">
                            <span className="truncate max-w-[200px]">{params.value}</span>
                            <button
                                className="cursor-pointer"
                                type="button"
                                onClick={() => {
                                    if (params.value) {
                                        navigator.clipboard.writeText(params.value);
                                        addToast({
                                            title: "Short slug nusxalandi",
                                            description: params.value,
                                            variant: "solid",
                                            color: "success",
                                        });
                                    }
                                }}
                            >
                                <Copy className="text-gray-500 hover:text-gray-800" size={16} />
                            </button>
                        </div>
                    );
                },
            },
            {
                field: "author_name",
                headerName: "Muallif",
                flex: 0.8,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    return <span>{params.data?.author?.name || "---"}</span>;
                },
            },
            {
                field: "category_names",
                headerName: "Rukni",
                flex: 1,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    const categories = params.data?.categories || [];

                    const categoryNames = categories.map((_: CategoriesItemType) => {
                        // const title = tabLang === "uz" ? category.title_uz : category.title_oz;
                        const title = "awdawdz";

                        const formattedTitle =
                            title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

                        return formattedTitle;
                    });

                    return (
                        <p
                            className="cursor-pointer line-clamp-2 text-ellipsis overflow-hidden leading-snug"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                maxHeight: "2.8em",
                                whiteSpace: "normal",
                            }}
                        >
                            {categoryNames.length > 0 ? categoryNames.join(", ") : "-- -- --"}
                        </p>
                    );
                },
            },
            {
                field: "publish_time",
                headerName: "Chop etilgan vaqti",
                width: 160,
                editable: false,
                cellRenderer: (params: ICellRendererParams) => {
                    const date = dayjs(params.value);
                    const now = dayjs();

                    const isToday = date.isSame(now, "day");
                    const isYesterday = date.isSame(now.subtract(1, "day"), "day");
                    const isTomorrow = date.isSame(now.add(1, "day"), "day");
                    const isDayAfterTomorrow = date.isSame(now.add(2, "day"), "day");

                    let label = date.format("DD.MM.YYYY HH:mm");
                    let color: "success" | "warning" | "primary" | "default" = "default";
                    let chipLabel: string | null = null;
                    let variant: "flat" | "solid" | "bordered" | "faded" | "light" | "dot" = "flat";

                    if (isYesterday) {
                        chipLabel = `Kecha ${date.format("HH:mm")}`;
                        color = "success";
                    } else if (isToday) {
                        chipLabel = `Bugun ${date.format("HH:mm")}`;
                        if (date.isBefore(now)) {
                            // chiqdi
                            color = "success";
                            variant = "bordered";
                        } else {
                            // hali chiqmagan
                            color = "warning";
                            variant = "bordered";
                        }
                    } else if (isTomorrow) {
                        chipLabel = `Ertaga ${date.format("HH:mm")}`;
                        color = "warning";
                    } else if (isDayAfterTomorrow) {
                        chipLabel = `Indinga ${date.format("HH:mm")}`;
                        color = "warning";
                        variant = "flat";
                    }

                    return chipLabel ? (
                        <Chip className="font-medium" color={color} size="md" variant={variant}>
                            {chipLabel}
                        </Chip>
                    ) : (
                        <span className="text-gray-600">{label}</span>
                    );
                },
            },
            {
                field: "publish_status",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">Holati</p>
                ),
                width: 150,
                editable: false,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    const publishTime = params.data.publish_time;

                    if (!publishTime) return <span>-</span>;

                    const now = new Date();
                    const publishDate = new Date(publishTime);

                    const isPublished = publishDate <= now;

                    return (
                        <Chip
                            className={`flex items-center justify-center h-7`}
                            color={isPublished ? "success" : "warning"}
                            variant="flat"
                        >
                            {isPublished ? "Chop etildi" : "Rejada"}
                        </Chip>
                    );
                },
            },
            {
                field: "viewed",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">
                        <Eye color="#9D9D9D" />
                    </div>
                ),
                width: 60,
                editable: false,
                cellClass: "!flex items-center justify-center",
            },
            {
                field: "status",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">Status</p>
                ),
                width: 100,
                editable: false,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            isDisabled={role === "writer" ? true : false}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                newsApi
                                    .updateNews(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["posts"] });
                                    });
                            }}
                        />
                    );
                },
            },
            {
                field: "slug",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">Saytda ko&apos;rish</p>
                ),
                width: 105,
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Button
                            isIconOnly
                            as={Link}
                            color="primary"
                            rel="noopener noreferrer"
                            size="sm"
                            target="_blank"
                            to={`https://vaqt.uz/${tabLang}/news/${params.value}`}
                            variant="flat"
                        >
                            <Eye size={16} />
                        </Button>
                    );
                },
            },
            {
                field: "action",
                headerComponent: () => (
                    <p className="!flex items-center justify-center w-full">Amallar</p>
                ),
                width: 100,
                pinned: "right",
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="sm"
                                variant="light"
                                onPress={() => {
                                    navigate({
                                        to: `/news/update/${params.data.id}?lang=${tabLang}`,
                                    });
                                }}
                            >
                                <Pencil size={16} />
                            </Button>

                            <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(params.data)}
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [tabLang],
    );

    // console.log(searchParams.viewed ? {} : { sort: "-publish_time" }, "searchParams?.viewed");
    console.log(searchParams.viewed);

    return (
        <div className="w-full h-full flex flex-col p-8 gap-y-3">
            <h3 className="font-bold">YANGILIKLAR</h3>
            <div className="flex items-center justify-between">
                <TabComponent modal={false} setTabLang={setTabLang} />

                <div className="flex gap-x-2">
                    {/* <Button
                        color="default"
                        startContent={<Filter size={16} />}
                        variant="flat"
                        onPress={() => setFiltersDrawer(true)}
                    >
                        Saralash
                    </Button> */}
                    {tabLang && (
                        <Button
                            color="primary"
                            startContent={<Plus size={16} />}
                            onPress={() => navigate({ to: `/news/create?lang=${tabLang}` })}
                        >
                            Yangilik yaratish
                        </Button>
                    )}
                </div>
            </div>

            <Filters />

            <div className="grow w-full">
                <AgGridTable<NewsItemType>
                    pagination
                    columnDefs={colDefs}
                    defaultColDef={{
                        cellClass: "content-center",
                        suppressHeaderMenuButton: true,
                        sortingOrder: [],
                    }}
                    fetchData={newsApi.getNews}
                    params={{
                        _l: tabLang ? tabLang : "oz",
                        ...searchParams,
                        ...(searchParams.viewed ? { sort: null } : { sort: "-publish_time" }),
                        per_page: 50,
                        include: "photo,author,categories",
                    }}
                    queryKey="posts"
                    rowBuffer={Infinity}
                    rowClassRules={{
                        "!bg-orange-50": (params) => {
                            const publishTime = params.data.publish_time;

                            const now = new Date();
                            const publishDate = new Date(publishTime);

                            const isPublished = publishDate <= now;

                            return !isPublished;
                        },
                    }}
                    rowHeight={60}
                    sideBar={false}
                    suppressRowVirtualisation={true}
                    onCellValueChanged={onUpdate}
                />
            </div>

            {isConfirmModalOpen && (
                <ConfirmModal
                    description="Siz yangilikni  o'chirmoqchimisiz?"
                    isOpen={isConfirmModalOpen}
                    title="Yangilik o'chirish"
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => deleteNew(newsModal.news?.id ?? 0)}
                />
            )}
            {/* {filtersDrawer && (
                <FiltersDrawer isOpen={filtersDrawer} onClose={() => setFiltersDrawer(false)} />
            )} */}
        </div>
    );
};
