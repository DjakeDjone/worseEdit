import { fromUser } from "~/server/model/user";
import { useUsersHandler } from "~/server/util/usersHandler";

export default defineEventHandler(async (event) => {
    const { username, token } = await readBody(event);
    const { createUser, setAuthentificated } = useUsersHandler();

    if (!username || !token) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Missing required fields (username, token)",
        });
    }

    try {
        const newUser = await createUser({ name: username, token: token });
        if (!newUser) {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Could not create user",
            });
        }
        await setAuthentificated(event, newUser);
        return fromUser(newUser);

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 409,
            statusMessage: error.statusMessage || "Conflict",
            message: error.message || "User registration failed",
        });
    }
});
