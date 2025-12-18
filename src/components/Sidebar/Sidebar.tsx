import { useState } from "react";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { menus as sidebarMenu } from "@/config/menu";

import { ProfileDropdown, SidebarAccordionItem, SidebarMenuLink } from "@/components/Sidebar";

import LogoIconSVG from "@/assets/icons/logo.svg?react";
import SwitcherIconSVG from "@/assets/icons/switcher.svg?react";

import { useUser } from "@/hooks/useUser";

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { user } = useUser();
    const role = user?.user_role.role;

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const filteredMenu = sidebarMenu.filter((item) => item.roles.includes(role || ""));

    return (
        <div
            className={`relative ${isOpen ? "w-[300px] p-3 pr-6" : "w-[70px] pt-3"} transition-[width, padding] duration-300 ease-in-out`}
        >
            <div className="flex justify-between items-center">
                <Link href="/">
                    <h1 className="flex items-center gap-2 text-white">
                        <LogoIconSVG />
                        {isOpen ? "Technologies" : null}
                    </h1>
                </Link>
                <Button
                    isIconOnly
                    className="-right-[10px] bg-transparent z-1"
                    onPress={handleToggle}
                >
                    <SwitcherIconSVG />
                </Button>
            </div>

            <div className="flex flex-col gap-2 mt-15">
                {filteredMenu.map((item) =>
                    item.children ? (
                        <SidebarAccordionItem key={item.label} item={item} sidebarIsOpen={isOpen} />
                    ) : (
                        <SidebarMenuLink key={item.label} item={item} sidebarIsOpen={isOpen} />
                    ),
                )}
            </div>

            <ProfileDropdown sidebarIsOpen={isOpen} />
        </div>
    );
};
