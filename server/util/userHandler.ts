import { generateDbEntry } from "../model/dbEntry";
import { User, UserData } from "../model/user";



export const useUsersHandler = () => {
    const db = useStorage("data"); // simple file kv
    const userCache = new Map<string, string>(); // username -> id

    const init = async () => {
        // load all users from db
        const users = await db.getKeys("users");
        for (const userId of users) {
            const user = await db.getItem<User>("users:"+userId);
            if (user) {
                userCache.set(user.name, userId);
            }
        }
    }

    const getUser = async (id: string, token: string) => {
        const user = await db.getItem<User>("users:"+id);
        if (user && user.token === token) {
            return user;
        }
    }

    const getUserByName = async (name: string, token: string) => {
        const userId = userCache.get(name);
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
        const usr = generateDbEntry<UserData>(id, user);
        await db.setItem(id, usr);
        return usr;
    }

    /// update user
    /// @param id user id
    /// @param user user object
    /// @returns user object
    /// @throws Error if user does not exist or token is invalid
    const updateUser = async (id: string, user: User) => {
        // check if user exists
        const existingUser = await db.getItem<User>("users:"+id);
        if (!existingUser) {
            throw new Error("User does not exist");
        }
        // check if token is valid
        if (existingUser.token !== user.token) {
            throw new Error("Invalid token");
        }
        await db.setItem(id, user);
        return user;
    }

    // set the user as authentificated
    // @param event H3Event<EventHandlerRequest>
    const setAuthentificated = async (event: any, user: User) => {
        // generate a new token
        const token = crypto.randomUUID();
        // set the token in the user object
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

    const getUserByCookie = async (event: any) => {
        const authToken = getCookie(event, "auth-token");
        if (!authToken) {
            return null;
        }
        const [id, token] = authToken.split(":");
        const user = await db.getItem<User>(":"+id);
        if (!user) {
            return null;
        }
        const validToken = user.authTokens?.find((t) => t.token === token);
        if (!validToken) {
            return null;
        }
        if (validToken.validTill < new Date()) {
            // token is expired
            user.authTokens = user.authTokens?.filter((t) => t.token !== token);
            await db.setItem(id, user);
            return null;
        }
        return user;
    }

    return {
        init,
        getUser,
        createUser,
        updateUser,
        setAuthentificated,
        getUserByCookie,
        getUserByName,
    }
};