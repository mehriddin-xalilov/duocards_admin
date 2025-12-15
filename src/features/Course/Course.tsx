import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { CourseModal, TabComponent } from "@/features/Course";
import { CourseItemType, courseApi } from "@/services/api/course.api";

export const Course = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/course" });
    const { lang } = search;
    const [courseDataModal, setCourseModal] = useState<{
        open: boolean;
        course?: CourseItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => courseApi.deleteCourse(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                title: "Kurs muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteCourse = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: CourseItemType) => {
        setCourseModal({ open: true, course: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: CourseItemType) => {
        setIsConfirmModalOpen(true);
        setCourseModal({ open: false, course: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        courseApi.updateCourse(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["courses"] });
    };

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 80,
                suppressMenu: true,
            },
            {
                field: "icon",
                headerName: "Icon",
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.icon?.thumbnails?.small?.src}
                        />
                    );
                },
            },
            {
                field: "name",
                headerName: "Sarlavha",
                flex: 1,
                editable: true,
            },
            {
                field: "status",
                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Status</div>
                ),
                width: 100,
                editable: false,
                cellClass: "!flex justify-center items-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <Switch
                            defaultSelected={!!params.value}
                            name={`status-${params.data.id}`}
                            size="sm"
                            onChange={(e) => {
                                const newStatus = e.target.checked ? 1 : 0;

                                courseApi
                                    .updateCourse(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["courses"] });
                                    });
                            }}
                        />
                    );
                },
            },
            {
                field: "action",
                width: 100,

                headerComponent: () => (
                    <div className="!flex items-center justify-center w-full">Amallar</div>
                ),
                cellClass: "!flex items-center justify-center",
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                isIconOnly
                                color="primary"
                                size="sm"
                                variant="light"
                                onPress={() => onHandleEdit(params.data)}
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
        [],
    );

    return (
        <div className="w-full h-full flex flex-col p-3">
            <div className="flex items-center justify-between mt-3 px-[20px]">
                <TabComponent modal={false} />
                <Button
                    color="primary"
                    startContent={<Plus color="white" size={18} />}
                    onPress={() => setCourseModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<CourseItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={courseApi.getCourses}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "icon,type",
                    }}
                    queryKey="courses"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz kursni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Kursni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteCourse(courseDataModal.course?.id ?? 0)}
            />

            <CourseModal courseDataModal={courseDataModal} setCourseModal={setCourseModal} />
        </div>
    );
};
