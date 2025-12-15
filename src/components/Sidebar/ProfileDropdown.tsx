import { useEffect, useState } from "react";

import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/react";

import DotsIconSVG from "@/assets/icons/dots.svg?react";

import { ProfileModal } from "./ProfileModal";

import { useAuthHandler } from "@/hooks/useAuth";
import { authApi } from "@/services/api/auth.api";
import { userApi } from "@/services/api/user.api";

type ProfileDropdownProps = {
    sidebarIsOpen: boolean;
};

export const ProfileDropdown = (props: ProfileDropdownProps) => {
    const { sidebarIsOpen } = props;
    const [user, setUser] = useState<any>(null);

    const { logoutHandler } = useAuthHandler();
    const [userModal, setUserModal] = useState<{
        open: boolean;
        user?: any;
    }>({ open: false });
    const handleLogout = async () => {
        await authApi.logout();
        logoutHandler();
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getMe<any>();

                setUser(response.data.user);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="absolute bottom-0 right-0 left-0 p-3 overflow-hidden">
            <ProfileModal setUserModal={setUserModal} userModal={userModal} />
            <Dropdown
                showArrow
                classNames={{
                    base: "before:bg-default-100",
                    content: "p-0 border-small border-divider bg-background",
                }}
                radius="sm"
            >
                <DropdownTrigger className="text-white">
                    <div className="flex items-center justify-between">
                        <User
                            avatarProps={{
                                src: user?.photo?.thumbnails?.normal?.src || "",
                            }}
                            description={`Rol: ${user?.user_role?.role}`}
                            name={user?.name ?? ""}
                        />
                        {sidebarIsOpen ? <DotsIconSVG /> : null}
                    </div>
                </DropdownTrigger>

                <DropdownMenu>
                    <DropdownSection showDivider>
                        <DropdownItem key="profile">
                            <div className="flex items-center justify-between">
                                <User
                                    avatarProps={{
                                        src: user?.photo?.thumbnails?.normal?.src || "",
                                    }}
                                    description={`Rol: ${user?.user_role?.role}`}
                                    name={user?.name ?? ""}
                                />
                            </div>
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection showDivider>
                        <DropdownItem
                            key="settings"
                            onClick={() => setUserModal({ user: user ?? undefined, open: true })}
                        >
                            Sozlamalar
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection>
                        <DropdownItem
                            key="logout"
                            classNames={{
                                base: "text-danger",
                            }}
                            color="danger"
                            onPress={handleLogout}
                        >
                            Chiqish
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};
