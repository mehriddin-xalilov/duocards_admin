import {
    DatePicker as DatePickerHeroui,
    DatePickerProps as DatePickerHerouiProps,
} from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

export type DatePickerProps = DatePickerHerouiProps & {
    name: string;
};

export const DatePicker = (props: DatePickerProps) => {
    return (
        <I18nProvider locale="en-GB">
            <DatePickerHeroui {...props} />
        </I18nProvider>
    );
};
