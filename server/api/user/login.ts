import { fromUser } from "~/server/model/user";
import { useUsersHandler } from "~/server/util/usersHandler";

export default defineEventHandler(async (event) => {
    const { username, token } = await readBody(event);
    const { getUserByName,setAuthentificated } = useUsersHandler();
    const newUser = await getUserByName(username, token);
    if (!newUser) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Invalid token",
        });
    }
    await setAuthentificated(event, newUser);
    return fromUser(newUser);
});