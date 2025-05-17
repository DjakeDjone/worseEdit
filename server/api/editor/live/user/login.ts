import { fromUser } from "~/server/model/user";
import { useUsersHandler } from "~/server/util/userHandler";

export default defineEventHandler(async (event) => {
    const { id, token } = await readBody(event);
    const { getUser } = useUsersHandler();
    const user = await getUser(id, token);
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Invalid token",
        });
    }
    return fromUser(user);
});