import { useUsersHandler } from "~/server/util/usersHandler";
import { useDocsHandler } from "~/server/util/docsHandler";

export default defineEventHandler(async (event) => {
    const { getUserByCookie, deleteUser } = useUsersHandler();
    const { deleteUserDocs } = useDocsHandler();
    
    // Authenticate user
    const user = await getUserByCookie(event);
    if (!user) {
        setResponseStatus(event, 401);
        return { error: "Not authenticated" };
    }

    try {
        // Delete all user documents first
        await deleteUserDocs(user.id);
        
        // Delete the user
        await deleteUser(user.id);
        
        // Clear auth cookie
        deleteCookie(event, "auth-token");
        
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete account:", error);
        setResponseStatus(event, 500);
        return { error: error.message || "Failed to delete account" };
    }
});
