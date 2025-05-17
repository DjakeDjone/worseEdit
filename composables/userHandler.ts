import { useStorage } from '@vueuse/core'

export const useUserHandler = () => {
    const user = useStorage("user", {
        id: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    })


    return {
        user,
    }
}