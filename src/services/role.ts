import { menus } from "@/config/menu";

export const getAccess = (role: string, path: string) => {
    const access = menus.filter((menu) => menu.href === path && menu.roles.includes(role));

    return access.length > 0;
};
