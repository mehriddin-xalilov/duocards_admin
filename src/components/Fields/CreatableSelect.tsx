import CreatableSelect from "react-select/creatable";

interface TagModeSelectProps {
    options?: {
        label: string;
        value: string;
    }[];
    onChange: (newValue: any, actionMeta: any) => void;
    defaultValue: any;
    placeholder?: string;
}

const defaultOptions = [
    {
        label: "o'zbekiston",
        value: "o'zbekiston",
    },
    {
        label: "yangiliklar",
        value: "yangiliklar",
    },
    {
        label: "xorij",
        value: "xorij",
    },
    {
        label: "urush",
        value: "urush",
    },
    {
        label: "pensiya",
        value: "pensiya",
    },
];

export const TagModeSelect = ({
    options = defaultOptions,
    onChange,
    defaultValue,
    placeholder,
}: TagModeSelectProps) => {
    const handleChange = (newValue: any, actionMeta: any) => {
        const values = newValue.map((item: any) => item.value);

        onChange(values, actionMeta);
    };

    return (
        <CreatableSelect
            isMulti
            closeMenuOnSelect={false}
            defaultValue={defaultValue}
            options={options}
            placeholder={placeholder}
            styles={{
                control: (base, _) => ({
                    ...base,
                    backgroundColor: "#F4F4F5",
                    overflow: "hidden",
                    borderRadius: "8px",
                    borderColor: "transparent",
                    boxShadow: "none",
                    "&:hover": {
                        borderColor: "transparent",
                        backgroundColor: "#E3E3E5",
                    },
                    minHeight: "56px",
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#2563eb", // tanlangan chip background
                    borderRadius: "6px",
                    padding: "2px 6px",
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: "white", // yozuv rangi
                    fontWeight: 500,
                }),
                multiValueRemove: (base, _) => ({
                    ...base,
                    color: "white",
                    cursor: "pointer",
                    ":hover": {
                        backgroundColor: "#1e40af", // hover qilinganda fon
                        color: "white",
                    },
                }),
                menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    borderRadius: "8px",
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                        ? "#2563eb"
                        : state.isFocused
                          ? "#e0e7ff"
                          : "white",
                    color: state.isSelected ? "white" : "black",
                    cursor: "pointer",
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "#9CA3AF", // text-gray-400
                }),
            }}
            onChange={handleChange}
        />
    );
};
