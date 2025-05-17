import { fromUser } from "~/server/model/user";
import { useUsersHandler } from "~/server/util/userHandler";

export default defineEventHandler(async (event) => {
    const { name, password, email } = await readBody(event); // Assuming these fields for registration
    const { createUser, setAuthentificated } = useUsersHandler(); // We'll need to add createUser to userHandler

    // Basic validation (you'll want to expand on this)
    if (!name || !password || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Missing required fields (username, password, email)",
        });
    }

    try {
        const newUser = await createUser({ name, token: password });
        if (!newUser) {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Could not create user",
            });
        }
        setAuthentificated(event, newUser); // Set the authentication cookie
        return fromUser(newUser);

    } catch (error: any) {
        // Handle potential errors from createUser, e.g., username or email already exists
        throw createError({
            statusCode: error.statusCode || 409, // Conflict or other error
            statusMessage: error.statusMessage || "Conflict",
            message: error.message || "User registration failed",
        });
    }
});
