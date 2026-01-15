export type SidebarMenuItem = {
    label: string;
    icon?: React.ReactNode;
    href: string;
    children?: SidebarMenuItem[];

    roles: string[];
    permissions?: string[];
};

export const menus: SidebarMenuItem[] = [
    {
        label: "Kategoriyalar",
        href: "/categories",
        roles: ["admin", "moderator"],
        permissions: ["menu.categories"],
    },
    {
        label: "Medialar",
        href: "/media",
        roles: ["admin", "moderator"],
        permissions: ["menu.media"],
    },
    {
        label: "Foydalanuvchilar",
        href: "/user",
        roles: ["admin"],
        permissions: ["menu.users"],
    },
    {
        label: "Rollar va Ruxsatlar",
        href: "/roles",
        roles: ["admin"],
        permissions: ["menu.roles"],
    },
];
