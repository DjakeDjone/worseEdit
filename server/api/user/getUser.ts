import { getServerSession } from '#auth'
import { useUsersHandler } from '~/server/util/usersHandler'
import { fromUser } from '~/server/model/user'


export default defineEventHandler(async (event) => {
    const { getUserByEmail, createUserFromOAuth, setAuthentificated, getUserByCookie } = useUsersHandler();
    
    // Check for NextAuth session first (GitHub OAuth)
    const session = await getServerSession(event);
    
    if (session?.user?.email) {
        // User is authenticated via GitHub OAuth
        // Create or get user from our custom system
        const customUser = await createUserFromOAuth(
            session.user.email,
            session.user.name || session.user.email.split('@')[0]
        );
        
        // Set the custom auth-token cookie for compatibility with existing system
        await setAuthentificated(event, customUser);
        
        // Return the user data
        return fromUser(customUser);
    }
    
    // Fall back to custom cookie-based auth
    try {
        const user = await getUserByCookie(event);
        if (!user) {
            // Not authenticated - return null instead of throwing
            return null;
        }
        return fromUser(user);
    } catch (error: any) {
        // Error checking auth - return null
        return null;
    }
});
