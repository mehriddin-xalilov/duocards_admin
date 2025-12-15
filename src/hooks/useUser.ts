import { userStore } from "@/store/user.store";

export const useUser = () => {
    const { user } = userStore();

    return { user };
};
