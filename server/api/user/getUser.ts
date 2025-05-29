import { useUsersHandler } from "~/server/util/usersHandler";
import { getCookie } from 'h3'; // Assuming you're using cookies for auth tokens
import { fromUser } from "~/server/model/user";

export default defineEventHandler(async (event) => {

    const { getUserByCookie } = useUsersHandler(); // We'll need to add getUserByToken to userHandler

    try {
        const user = await getUserByCookie(event);
        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "User not found or token invalid",
            });
        }
        // Return only non-sensitive user data
        return fromUser(user);
    } catch (error: any) {
        throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "User not found or token invalid",
            });
    }
});
