import { useStorage } from '@vueuse/core'
import type { FrontendUser, User } from '~/server/model/user'

export const useUserHandler = () => {
    const user = useStorage("user", {
        id: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as FrontendUser)

    const loadMe = async () => {
        try {
            const res = await useNuxtApp().$api<User>("/api/user/getUser", {
                method: "GET",
                credentials: "include",
            });

            if (res) {
                user.value = res;
            }
        } catch (error) {
            // Silently handle - user is not authenticated
            console.debug("User not authenticated");
        }
    }

    const logout = () => {
        user.value = {
            id: "",
            name: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

    return {
        user,
        loadMe,
        logout
    }
}