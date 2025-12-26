import { generateDbEntry } from "../model/dbEntry";
import { Doc } from "../model/doc";
import { FileMeta, generateFileMeta } from "../model/folder";
import { User, UserData } from "../model/user";


export const usernameCache = new Map<string, string>(); // username -> id

export const useUsersHandler = () => {
    const tableName = "users";
    const db = useStorage("data"); // simple file kv

    const init = async () => {
        // load all users from db
        console.log("Initializing users handler");
        
        const userIds = await db.getKeys(tableName);
        console.log(`Found ${userIds.length} users in db`);
        
        for (let userId of userIds) {
            userId = userId.replace(tableName + ":", "");
            const user = await getUserUnsafe(userId);
            if (user) {
                usernameCache.set(user.name, userId);
            }
        }
    }

    const getUserUnsafe = async (id: string) => {
        const user = await db.getItem<User>(tableName + ":" + id);
        if (user) {
            return user;
        }
        throw new Error("User not found");
    }

    const getUser = async (id: string, token: string) => {
        const user = await getUserUnsafe(id);
        if (user && user.token === token) {
            return user;
        }
    }

    const getUserByName = async (name: string, token: string) => {
        const userId = usernameCache.get(name);        
        if (!userId) {
            return null;
        }
        return await getUser(userId, token);
    }

    /// create a new user
    /// @param id user id
    /// @param user user object
    /// @returns user object
    /// @throws Error if user already exists
    const createUser = async (user: UserData) => {
        const id = crypto.randomUUID();
        const token = user.token || crypto.randomUUID(); // Generate token if not provided
        const usr = generateDbEntry<UserData>(id, { ...user, token });

        await db.setItem(tableName + ":" + id, usr);
        usernameCache.set(usr.name, id);
        return usr;
    }

    /// update user
    /// @param id user id
    /// @param user user object
    /// @returns user object
    /// @throws Error if user does not exist or token is invalid
    const updateUser = async (id: string, user: User) => {
        // check if user exists
        const existingUser = await db.getItem<User>(tableName + ":" + id);
        if (!existingUser) {
            throw new Error("User does not exist");
        }
        // check if token is valid
        if (existingUser.token !== user.token) {
            throw new Error("Invalid token");
        }
        await db.setItem(tableName + ":" + id, user);
        usernameCache.set(user.name, id);
        return user;
    }

    // set the user as authentificated
    // @param event H3Event<EventHandlerRequest>
    const setAuthentificated = async (event: any, user: User) => {
        // generate a new token
        const token = crypto.randomUUID();
        // set the token in the user object
        if (!user.authTokens) {
            user.authTokens = [];
        }
        user.authTokens?.push({
            validTill: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 1 week
            token,
        });
        // set the token in the cookie
        setCookie(event, "auth-token", `${user.id}:${token}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        // update the user in the db
        updateUser(user.id, user);
        return user;
    }

    const validateUserByToken = async (id: string, token: string): Promise<User | null> => {
        const user = await getUserUnsafe(id);
        if (!user) {
            return null;
        }

        const validToken = user.authTokens?.find((t) => t.token === token);
        if (!validToken) {
            return null;
        }

        if (validToken.validTill < new Date()) {
            console.log(`Token expired for user ${user.name}`);
            user.authTokens = user.authTokens?.filter((t) => t.token !== token);
            await db.setItem(tableName + ":" + id, user);
            return null;
        }

        return user;
    }

    const getUserByCookieWs = async (req: Request) => {
        const authToken = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("auth-token="))?.split("=")[1];
        const authTokenEncoded = authToken ? decodeURIComponent(authToken) : null;
        console.log(`getUserByCookieWs: ${authTokenEncoded}`);
        

        if (!authTokenEncoded) {
            return null;
        }
        const [id, token] = authTokenEncoded.split(":");
        console.log(`getUserByCookieWs: id: ${id}, token: ${token}`);
        return validateUserByToken(id, token);
    }

    const getUserByCookie = async (event: any) => {
        const authToken = getCookie(event, "auth-token");
        console.log(`getUserByCookie: ${authToken}`);

        if (!authToken) {
            return null;
        }
        const [id, token] = authToken.split(":");
        console.log(`getUserByCookie: id: ${id}, token: ${token}`);

        const user = await validateUserByToken(id, token);
        if (!user) {
            deleteCookie(event, "auth-token");
            return null;
        }
        return user;
    }

    const addFileToUser = async (userId: string, fileMeta: FileMeta) => {
        const user = await getUserUnsafe(userId);
        if (!user) {
            throw new Error("User not found or invalid token");
        }
        if (!user.files) {
            user.files = [];
        }
        user.files.push(fileMeta);
        await updateUser(userId, user);
        return user;
    }

    const removeFileFromUser = async (userId: string, fileId: string) => {
        const user = await getUserUnsafe(userId);
        if (!user) {
            throw new Error("User not found or invalid token");
        }
        if (!user.files) {
            throw new Error("User has no files");
        }
        user.files = user.files.filter((file) => file.fileId !== fileId);
        await updateUser(userId, user);
        return user;
    }

    const inviteUserToDoc = async (doc: Doc, userId: string, hostUser: User) => {
        // const user = await getUserUnsafe(userId);
        // if (!user) {
        //     throw new Error("User not found");
        // }

        // if (!user.inviteFiles) {
        //     user.inviteFiles = [];
        // }
        // const fileMeta: InvitionFileMeta = {
        //     ...generateFileMeta(doc),
        //     invitedBy: hostUser.id,
        //     invitedAt: new Date(),
        // }
        // user.inviteFiles.push(fileMeta);
        // await updateUser(userId, user);
        // return user;
    }

    const getUserByEmail = async (email: string) => {
        const userIds = await db.getKeys(tableName);
        for (let userId of userIds) {
            userId = userId.replace(tableName + ":", "");
            const user = await getUserUnsafe(userId);
            if (user && user.email === email) {
                return user;
            }
        }
        return null;
    }

    const createUserFromOAuth = async (email: string, name: string) => {
        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return existingUser;
        }

        // Create new user
        const userData: UserData = {
            name: name || email.split('@')[0], // Use email prefix if no name
            email: email,
            password: '', // No password for OAuth users
            files: [],
        };

        return await createUser(userData);
    }

    const deleteUser = async (userId: string) => {
        const user = await getUserUnsafe(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Remove from cache
        usernameCache.delete(user.name);
        // Delete from database
        await db.removeItem(tableName + ":" + userId);
    }

    return {

        init,
        getUser,
        createUser,
        updateUser,
        setAuthentificated,
        getUserByCookie,
        getUserByName,
        getUserByEmail,
        createUserFromOAuth,
        addFileToUser,
        getUserByCookieWs,
        removeFileFromUser,
        inviteUserToDoc,
        getUserUnsafe, // careful with this, it does not check token
        validateUserByToken,
        deleteUser,
    }
};