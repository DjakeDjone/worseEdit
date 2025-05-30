import { useUserHandler } from "~/composables/userHandler";
import { Permission } from "~/server/model/permission";
import { useDocsHandler } from "~/server/util/docsHandler";
import { useUsersHandler } from "~/server/util/usersHandler";


export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string };
    const { permission: permissionUnparsed, link, reusable } = await readBody(event);
    let permission: Permission;
    try {
        permission = JSON.parse(permissionUnparsed);
    } catch (e) {
        console.error("Failed to parse permission:", e);
        setResponseStatus(event, 400);
        return { error: "Invalid permission format" };
    }

    const { getUserByCookie } = useUsersHandler();
    const user = await getUserByCookie(event);
    if (!user) {
        console.warn("Unauthorized access attempt to invite user");
        setResponseStatus(event, 401);
        return;
    }
    if (!id) {
        setResponseStatus(event, 400);
        return { error: "Document ID is required" };
    }
    if (!permission || !Object.values(Permission).includes(permission)) {
        setResponseStatus(event, 400);
        return { error: "Invalid permission" };
    }
    if (!link || typeof link !== "string") {
        setResponseStatus(event, 400);
        return { error: "Invalid link format" };
    }

    // update doc
    const { inviteUserToDoc } = useDocsHandler();
    const doc = await inviteUserToDoc(id, permission, link, reusable);
    if (!doc) {
        setResponseStatus(event, 500);
        return { error: "Failed to invite user to document" };
    }

    const { inviteUserToDoc: userInviteUserToDoc } = useUsersHandler();
    // await userInviteUserToDoc(doc, user);

    setResponseStatus(event, 200);
    return { message: "User invited successfully", doc };
});