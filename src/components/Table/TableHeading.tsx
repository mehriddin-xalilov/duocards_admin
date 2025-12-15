import { Button } from "@heroui/button";
import { useLocation } from "@tanstack/react-router";

import { TableProps } from "@/components/Table/types";

type TableHeadingProps = Pick<
    TableProps<unknown>,
    "title" | "description" | "createButton" | "filter" | "tabs"
>;

export const TableHeading = (props: TableHeadingProps) => {
    const { title = "", description, createButton, filter, tabs } = props;
    const location = useLocation();

    const getTitle = (title: string) => {
        return title || location.pathname.replace("/", "").toUpperCase();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold">{getTitle(title)}</h1>
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>

                {createButton && (
                    <Button
                        color="primary"
                        variant="shadow"
                        onPress={() => {
                            if (typeof createButton === "object") {
                                createButton.onPress();
                            }
                        }}
                    >
                        {createButton?.title || "+ Yaratish"}
                    </Button>
                )}
            </div>

            {filter}
            {tabs}
        </div>
    );
};
