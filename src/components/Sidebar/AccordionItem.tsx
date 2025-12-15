import { Accordion, AccordionItem, Tooltip } from "@heroui/react";
import { Link, useLocation } from "@tanstack/react-router";

import { SidebarMenuItem } from "@/config/menu";

type SidebarAccordionProps = {
    item: SidebarMenuItem;
    sidebarIsOpen: boolean;
    className?: string;
};

export const SidebarMenuLink = (props: SidebarAccordionProps) => {
    const { item, sidebarIsOpen, className } = props;
    const location = useLocation();

    const active = location.pathname.includes(item.href);

    return (
        <Link
            key={item.label}
            className={`hover:bg-linear-to-r hover:from-white/15 hover:to-white/5 block transition-all duration-300 text-sm text-white/56 p-2 px-4 shadow-sm rounded-medium ${className} ${active ? "bg-linear-to-r from-white/15 to-white/5" : null}`}
            to={item.href}
        >
            <Tooltip showArrow content={item.label} hidden={sidebarIsOpen} placement="right">
                {sidebarIsOpen ? item.label : item.label.charAt(0).toUpperCase()}
            </Tooltip>
        </Link>
    );
};

export const SidebarAccordionItem = (props: SidebarAccordionProps) => {
    const { item, sidebarIsOpen } = props;

    const location = useLocation();

    const active = item.children?.some((child) => child.href === location.pathname);

    return (
        <Accordion key={item.label} className="p-0" variant="splitted">
            <AccordionItem
                HeadingComponent={({ children }) => (
                    <div
                        className={`[&>button]:p-2 [&>button]:px-4 rounded-medium ${active ? "bg-linear-to-r from-white/10 to-white/0" : null}`}
                    >
                        {children}
                    </div>
                )}
                className={`bg-transparent p-0 shadow-sm`}
                hideIndicator={!item.children || !sidebarIsOpen}
                title={
                    <Tooltip
                        showArrow
                        content={item.label}
                        hidden={sidebarIsOpen}
                        placement="right"
                    >
                        <span className={"text-sm text-white/56"}>
                            {sidebarIsOpen ? item.label : item.label.charAt(0).toUpperCase()}
                        </span>
                    </Tooltip>
                }
            >
                {item.children?.map((child) => (
                    <SidebarMenuLink
                        key={child.label}
                        className="mb-2 mx-2"
                        item={child}
                        sidebarIsOpen={sidebarIsOpen}
                    />
                ))}
            </AccordionItem>
        </Accordion>
    );
};
