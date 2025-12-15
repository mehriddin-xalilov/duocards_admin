import { useMemo, useState } from "react";

import { addToast, Button, Switch } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Pencil, Plus, Trash } from "lucide-react";

import AgGridTable from "@/components/AgGridTable/Table";
import { ImagePreview } from "@/components/ImagePreview";

import { ConfirmModal } from "@/components";
import { TeacherModal, TabComponent } from "@/features/Teacher";
import { TeacherItemType, teacherApi } from "@/services/api/teacher.api";

export const Teacher = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const search = useSearch({ from: "/_main/teachers" });
    const { lang } = search;
    const [teacherDataModal, setTeacherModal] = useState<{
        open: boolean;
        teacher?: TeacherItemType;
        lang_hash?: string;
    }>({ open: false });

    const queryClient = useQueryClient();

    const { mutate: deleteById } = useMutation({
        mutationFn: (id: number) => teacherApi.deleteTeacher(id),
        onSuccess: () => {
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            addToast({
                title: "Ustoz muvaffaqiyatli o'chirildi",
                variant: "solid",
                color: "success",
            });
        },
    });

    const deleteTeacher = (id: number) => {
        deleteById(id);
    };

    const onHandleEdit = (item: TeacherItemType) => {
        setTeacherModal({ open: true, teacher: item, lang_hash: item.lang_hash });
    };

    const handleDelete = (item: TeacherItemType) => {
        setIsConfirmModalOpen(true);
        setTeacherModal({ open: false, teacher: item, lang_hash: item.lang_hash });
    };

    const onUpdate = (e: CellValueChangedEvent) => {
        if (!e.colDef.field) return;

        teacherApi.updateTeacher(e.data.id, {
            [e.colDef.field]: e.newValue,
        });

        queryClient.invalidateQueries({ queryKey: ["teachers"] });
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
                field: "photo",
                headerName: "Foto",
                width: 120,
                cellRenderer: (params: ICellRendererParams) => {
                    return (
                        <ImagePreview
                            alt={params.data.name}
                            className="w-20 h-[55px] object-cover rounded-none"
                            src={params.data.photo?.thumbnails?.small?.src}
                        />
                    );
                },
            },
            {
                field: "full_name",
                headerName: "To'liq ism",
                flex: 1,
                editable: true,
            },
            {
                field: "position",
                headerName: "Pozitsiya",
                flex: 1,
                editable: true,
            },
            {
                field: "description",
                headerName: "Tavsif",
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

                                teacherApi
                                    .updateTeacher(params.data.id, {
                                        status: newStatus,
                                    })
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ["teachers"] });
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
                    onPress={() => setTeacherModal({ open: true })}
                >
                    {"Yaratish"}
                </Button>
            </div>
            <div className="grow w-full p-5">
                <AgGridTable<TeacherItemType>
                    pagination
                    columnDefs={colDefs}
                    fetchData={teacherApi.getTeachers}
                    params={{
                        _l: lang ? lang : "uz",
                        include: "photo,video",
                    }}
                    queryKey="teachers"
                    rowHeight={60}
                    sideBar={false}
                    onCellValueChanged={onUpdate}
                />
            </div>
            <ConfirmModal
                description="Siz ustozni o'chirmoqchimisiz?"
                isOpen={isConfirmModalOpen}
                title="Ustozni o'chirish"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deleteTeacher(teacherDataModal.teacher?.id ?? 0)}
            />

            <TeacherModal teacherDataModal={teacherDataModal} setTeacherModal={setTeacherModal} />
        </div>
    );
};
