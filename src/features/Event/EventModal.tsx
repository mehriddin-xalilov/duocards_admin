import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { now, getLocalTimeZone } from "@internationalized/date";
import { TabComponent } from "./Tabs";
import { parseZonedDateTime } from "@internationalized/date";
import { toLocalDateISO, toLocalTimeISO } from "@/services";
import { Form, FormFields, Modal } from "@/components";
import { eventApi, EventItemType } from "@/services/api/event.api";
import { ValidationField } from "@/components/Form/types";
import { Time } from "@internationalized/date";

type EventModalProps = {
    setEventModal: ({
        open,
        event,
        lang_hash,
    }: {
        open: boolean;
        event?: EventItemType;
        lang_hash?: string;
    }) => void;
    eventDataModal: { open: boolean; event?: EventItemType; lang_hash?: string };
};

export const EventModal = (props: EventModalProps) => {
    const {
        eventDataModal: { open, event, lang_hash },
        setEventModal,
    } = props;
    const queryClient = useQueryClient();
    const search = useSearch({ from: "/_main/event" });
    const [lang, setLang] = useState(search.lang ?? "uz");

    // useEffect(() => {
    //     if (search.lang) {
    //         setLang(search.lang ? search.lang : "oz");
    //     }
    // }, [search.lang]);
    const translations = useMemo(
        () => [...(event?.translations || []), { id: event?.id || 0, lang: lang }],
        [open],
    );

    const onClose = () => {
        setLang(search.lang);
        setEventModal({ open: false });
    };

    const onChange = (activeKey: string) => {
        setLang(activeKey);
    };

    const fetchEvent = async () => {
        const activeLang = translations?.find((item) => item.lang === lang);

        if (activeLang && activeLang.id !== 0) {
            const res = await eventApi.getEvent<EventItemType>(activeLang.id);

            if (res.data) {
                setEventModal({ open: true, event: res.data, lang_hash: lang_hash });
            }
        } else {
            setEventModal({
                open: true,
                lang_hash: lang_hash,
                event: {
                    created_at: "",
                    description: "",
                    id: 0,
                    lang: "",
                    updated_at: "",
                    end_time: "",
                    date: "",
                    start_time: "",
                    lang_hash: "",
                    status: 0,
                    location: "",
                    title: "",
                    translations: [],
                },
            });
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["event"] });
        onClose();
        addToast({
            title: "Success",
            variant: "solid",
            color: "success",
            description: "Tadbir muvaffaqiyatli yaratildi",
        });
    };

    useEffect(() => {
        setLang(search.lang);
    }, [search.lang]);
    useEffect(() => {
        if (open) {
            fetchEvent();
        }
    }, [lang]);
    const currentTime = now(getLocalTimeZone());

    const defaultEndTime = event?.end_time
        ? (() => {
              const [hour, minute] = event.end_time.split(":").map(Number);
              return new Time(hour, minute);
          })()
        : new Time(currentTime.hour, currentTime.minute);
    const defaultStartTime = event?.start_time
        ? (() => {
              const [hour, minute] = event.start_time.split(":").map(Number);
              return new Time(hour, minute);
          })()
        : new Time(currentTime.hour, currentTime.minute);
    const fields = useMemo(() => {
        const baseFields: ValidationField[] = [
            {
                name: "title",
                validationType: "string",
                isRequired: true,
                defaultValue: event?.title ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "title",
                validationType: "string",
                isRequired: true,
                defaultValue: event?.title ?? "",
                errorMessage: "Iltimos sarlavhani kiriting",
            },
            {
                name: "description",
                validationType: "string",
                isRequired: true,
                defaultValue: event?.description ?? "",
                errorMessage: "Iltimos tavsif kiriting",
            },

            {
                name: "location",
                validationType: "string",
                isRequired: true,
                defaultValue: event?.description ?? "",
                errorMessage: "Iltimos manzil kiriting",
            },
            {
                name: "start_time",
                validationType: "any",
                isRequired: true,
                defaultValue: defaultStartTime,
                errorMessage: "Iltimos amal qilish muddatini kiriting",
                onSubmit: (value: any) => toLocalTimeISO(value),
            },
            {
                name: "end_time",
                validationType: "any",
                isRequired: true,
                defaultValue: defaultEndTime,
                errorMessage: "Iltimos amal qilish muddatini kiriting",
                onSubmit: (value: any) => toLocalTimeISO(value),
            },
            {
                name: "date",
                validationType: "any",
                isRequired: true,
                defaultValue: now(getLocalTimeZone()),
                errorMessage: "Iltimos amal qilish muddatini kiriting",
                onSubmit: (value: any) => toLocalDateISO(value),
            },

            {
                name: "lang",
                validationType: "string",
                isRequired: true,
                defaultValue: lang,
            },
            {
                name: "status",
                validationType: "boolean",
                defaultValue: Boolean(event?.status),
                onSubmit: (value) => (value ? 1 : 0),
            },
        ];

        if (lang_hash) {
            baseFields.push({
                name: "lang_hash",
                validationType: "string",
                isRequired: true,
                defaultValue: lang_hash,
            });
        }

        return baseFields;
    }, [event, lang, lang_hash]);

    console.log(event);
    return (
        <Modal
            header={event ? "Tadbirni o'zgartirish" : "Tadbir yaratish"}
            isOpen={open}
            onClose={onClose}
        >
            <TabComponent modal={true} onChange={onChange} />
            <Form
                key={event?.id}
                fetchFunction={
                    event?.id
                        ? (values) => eventApi.updateEvent(event.id, values)
                        : eventApi.createEvent
                }
                fields={fields}
                onSuccess={onSuccess}
                onValuesChange={(val) => console.log(val)}
            >
                {({ isLoading, setValue, ...formRestProps }) => {
                    return (
                        <div className="flex flex-col gap-4">
                            <FormFields.Input
                                label="Sarlavha"
                                name="title"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <FormFields.Textarea
                                label="Tavsif"
                                name="description"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <FormFields.Input
                                label="Manzil"
                                name="location"
                                radius="sm"
                                type="text"
                                setValue={setValue}
                                {...formRestProps}
                            />
                            <div className=" flex  gap-3">
                                <FormFields.DatePicker
                                    label="Tadbir boshlnish vaqti"
                                    name="start_time"
                                    radius="sm"
                                    /* @ts-ignore */
                                    defaultValue={defaultStartTime}
                                    type={"time"}
                                    setValue={setValue}
                                    {...formRestProps}
                                />
                                <FormFields.DatePicker
                                    label="Tadbir tugash vaqti"
                                    /* @ts-ignore */
                                    defaultValue={defaultEndTime}
                                    name="end_time"
                                    radius="sm"
                                    type={"time"}
                                    setValue={setValue}
                                    {...formRestProps}
                                />
                            </div>

                            <FormFields.DatePicker
                                label="Tadbir sanasi"
                                name="date"
                                granularity="day"
                                defaultValue={
                                    (event?.date &&
                                        parseZonedDateTime(
                                            event?.date.replace(" ", "T") + "[UTC]",
                                        )) ||
                                    null
                                }
                                radius="sm"
                                setValue={setValue}
                                {...formRestProps}
                            />

                            <FormFields.Switch
                                label="Status"
                                name="status"
                                {...formRestProps}
                                setValue={setValue}
                            />
                            <Button color="primary" isLoading={isLoading} radius="sm" type="submit">
                                {event?.id ? "O'zgartirish" : "Yaratish"}
                            </Button>
                        </div>
                    );
                }}
            </Form>
        </Modal>
    );
};
