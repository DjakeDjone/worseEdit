import { useStorage } from '@vueuse/core'
import type { User } from '~/server/model/user'

export const useUserHandler = () => {
    const user = useStorage("user", {
        id: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as User)

    const loadMe = async () => {
        const res = await useNuxtApp().$api<User>("/api/user/getUser", {
            method: "GET",
            credentials: "include",
        });

        if (res) {
            user.value = res;
        } else {
            console.warn("Failed to load user data");
        }
    }


    return {
        user,
        loadMe,
    }
}