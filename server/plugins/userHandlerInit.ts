import { useUsersHandler } from "../util/usersHandler"

export default defineNitroPlugin((nitroApp) => {
    const userHandler = useUsersHandler();

    userHandler.init();
})
