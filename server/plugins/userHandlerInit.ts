import { useUsersHandler } from "../util/userHandler"

export default defineNitroPlugin((nitroApp) => {
    const userHandler = useUsersHandler();

    userHandler.init();
})
