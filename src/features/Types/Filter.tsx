import { useLocation, useNavigate } from "@tanstack/react-router";

import { Input } from "@/components/Fields";

import { debounce } from "@/services/helpers";

export const Filter = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    const handleChange = debounce((key: string, value: string) => {
        navigate({
            search: {
                ...search,
                [key]: value,
            },
        });
    }, 500);

    return (
        <div className="flex items-center gap-2 pl-5">
            <Input
                className="max-w-[600px]"
                defaultValue={search.search ? search.search.toString() : ""}
                name="title"
                placeholder="Qidirish"
                onChange={(e) => handleChange("title", e.target.value.toString())}
            />
        </div>
    );
};
