import { fromUser } from "~/server/model/user";
import { useUsersHandler } from "~/server/util/userHandler";

export default defineEventHandler(async (event) => {
    const { username, token } = await readBody(event);
    const { getUserByName } = useUsersHandler();
    const user = await getUserByName(username, token);
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Invalid token",
        });
    }
    return fromUser(user);
});