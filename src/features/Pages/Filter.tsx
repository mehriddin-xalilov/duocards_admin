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
        <div className="flex items-center gap-2">
            <Input
                className="max-w-[600px]"
                defaultValue={search.search ? search.search.toString() : ""}
                name="search"
                placeholder="Search (company name, domain, ip address, director name)"
                onChange={(e) => handleChange("search", e.target.value.toString())}
            />
        </div>
    );
};
