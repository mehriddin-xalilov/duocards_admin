import { Key, useEffect, useState } from "react";

import { Tab, Tabs } from "@heroui/react";
import { useNavigate, useSearch } from "@tanstack/react-router";

interface TabComponentProps {
    modal?: boolean;
    onChange?: (key: string) => void;
    setTabLang?: (key: string) => void;
}
export const TabComponent = ({
    modal,
    onChange = () => {},
    setTabLang = () => {},
}: TabComponentProps) => {
    const navigate = useNavigate({ from: "/pages" });
    const search = useSearch({ from: "/_main" });
    const [selectedLang, setSelectedLang] = useState<string>(search.lang ? search.lang : "uz");

    const onSelectChange = (key: Key) => {
        !modal && navigate({ search: { lang: key } });
        setSelectedLang(key as string);
        onChange(String(key));
    };

    useEffect(() => {
        if (search.lang && search.lang !== selectedLang) {
            setSelectedLang(search.lang ? search.lang : "uz");
        }

        if (!window.location.pathname.includes("update")) {
            navigate({ search: { lang: selectedLang } });
        }
    }, [search.lang]);

    useEffect(() => {
        if (setTabLang) {
            setTabLang(selectedLang as string);
        }
    }, [selectedLang]);

    return (
        <Tabs
            className=" overflow-x-auto scrollbar-hide"
            selectedKey={selectedLang}
            onSelectionChange={onSelectChange}
        >
            {/* <Tab key="oz" title="Ўзбекча" /> */}
            <Tab key="uz" title="O‘zbekcha" />
            <Tab key="ru" title="Русский" />
            {/* <Tab key="en" title="English" /> */}
        </Tabs>
    );
};
