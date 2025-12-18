export type SidebarMenuItem = {
    label: string;
    icon?: React.ReactNode;
    href: string;
    children?: SidebarMenuItem[];
    roles: string[];
};

export const menus: SidebarMenuItem[] = [
    {
        label: "Kategoriyalar",
        href: "/categories",
        roles: ["admin", "moderator"],
    },
    {
        label: "Medialar",
        href: "/media",
        roles: ["admin", "moderator"],
    },
    {
        label: "Foydalanuvchilar",
        href: "/user",
        roles: ["admin"],
    },
];
