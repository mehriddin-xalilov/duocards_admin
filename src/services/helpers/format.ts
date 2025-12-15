export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
};

export const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "+($1) $2-$3-$4-$5");
};

export const formatPrice = (price: number, currency?: string) => {
    return (
        price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (currency ? " " + currency : "")
    );
};

export const toLocalISO = (obj: {
    year: number;
    month: number;
    day: number;
    hour: string;
    minute: string;
}) => {
    const { year, month, day, hour, minute } = obj;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${hour}:${Number(minute) < 10 ? `0${minute}` : minute}:00`;
};

export const toLocalDateISO = (obj: { year: number; month: number; day: number }) => {
    const { year, month, day } = obj;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const toLocalTimeISO = (value: any | null | undefined) => {
    if (!value) return "";
    const hour = String(value.hour).padStart(2, "0");
    const minute = String(value.minute).padStart(2, "0");
    return `${hour}:${minute}:00`;
};
