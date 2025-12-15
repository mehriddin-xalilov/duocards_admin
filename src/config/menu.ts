export type SidebarMenuItem = {
    label: string;
    icon?: React.ReactNode;
    href: string;
    children?: SidebarMenuItem[];
    roles: string[];
};

export const menus: SidebarMenuItem[] = [
    {
        label: "Bannerlar",
        href: "/banner",
        roles: ["admin", "writer", "moderator"],
    },
    {
        label: "Yangilik / Kategoriya",
        href: "/",
        roles: ["admin", "writer", "moderator"],
        children: [
            {
                label: "Yangiliklar",
                href: "/news",
                roles: ["admin", "moderator"],
            },
            {
                label: "Kategoriyalar",
                href: "/categories",
                roles: ["admin", "moderator"],
            },
        ],
    },

    {
        label: "Kurs / Tur",
        roles: ["admin", "moderator"],
        href: "/",
        children: [
            {
                label: "Kurslar",
                href: "/course",
                roles: ["admin", "moderator"],
            },
            {
                label: "Turlar",
                href: "/type",
                roles: ["admin", "moderator"],
            },
        ],
    },
    {
        label: "Sahifalar",
        roles: ["admin", "moderator"],
        href: "/",
        children: [
            {
                label: "Sahifalar",
                href: "/pages",
                roles: ["admin", "moderator"],
            },
            {
                label: "Rahbariyat",
                href: "/leadership",
                roles: ["admin", "moderator"],
            },
            {
                label: "Dokumentlar",
                href: "/documents",
                roles: ["admin", "moderator"],
            },
        ],
    },
    {
        label: "O'quv markaz haqida",
        href: "/about",
        roles: ["admin", "writer", "moderator"],
    },

    {
        label: "Ustozlar",
        href: "/teachers",
        roles: ["admin", "moderator"],
    },

    {
        label: "Sharhlar",
        href: "/feedbacks",
        roles: ["admin", "moderator"],
    },
    {
        label: "FAQ",
        href: "/faqs",
        roles: ["admin", "writer", "moderator"],
    },
    {
        label: "Tadbirlar",
        href: "/event",
        roles: ["admin", "writer", "moderator"],
    },
    {
        label: "Hamkorlar",
        href: "/partners",
        roles: ["admin", "writer", "moderator"],
    },
    {
        label: "Foydali havolalar",
        href: "/links",
        roles: ["admin", "writer", "moderator"],
    },
    {
        label: "Medialar",
        href: "/media",
        roles: ["admin", "moderator"],
    },
    {
        label: "Menular",
        href: "/menu",
        roles: ["admin", "moderator"],
    },

    // {
    //     label: "Foydalanuvchilar",
    //     href: "/user",
    //     roles: ["admin"],
    // },

    {
        label: "Sozlamalar",
        href: "/settings",
        roles: ["admin", "moderator"],
    },
];
