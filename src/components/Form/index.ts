import {
    FormAsyncSelect,
    FormDatePicker,
    FormInput,
    FormSelect,
    FormSwitch,
    FormFileUpload,
    FormTextarea,
    FormAsyncMultiSelect,
    FormTreeCheckBox,
    FormAsyncAutocomplete,
} from "@/components/Form/Fields";
import { FormRadioGroup } from "@/components/Form/Fields/Radio";

export const FormFields = {
    Input: FormInput,
    Switch: FormSwitch,
    Select: FormSelect,
    AsyncSelect: FormAsyncSelect,
    DatePicker: FormDatePicker,
    FileUpload: FormFileUpload,
    Textarea: FormTextarea,
    RadioGroup: FormRadioGroup,
    TreeCheckBox: FormTreeCheckBox,
    AsyncMultiSelect: FormAsyncMultiSelect,
    AsyncAutocomplete: FormAsyncAutocomplete,
};

export { Form } from "@/components/Form/Form";
