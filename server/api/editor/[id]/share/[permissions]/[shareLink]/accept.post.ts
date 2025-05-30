import { generateFileMeta } from "~/server/model/folder";
import { Permission } from "~/server/model/permission";
import { useDocsHandler } from "~/server/util/docsHandler";
import { useUsersHandler } from "~/server/util/usersHandler";


export default defineEventHandler(async (event) => {
    const { id, permissions, shareLink } = event.context.params as { id: string, permissions: string, shareLink: string };

    if (!id || !permissions || !shareLink) {
        setResponseStatus(event, 400);
        return { error: "Missing required parameters" };
    }
    const permission = permissions as Permission;

    const fullShareLink = `${permission}/${shareLink}`;


    const { getUserByCookie } = useUsersHandler();
    const user = await getUserByCookie(event);
    if (!user) {
        console.warn("Unauthorized access attempt to accept share link");
        setResponseStatus(event, 401);
        return;
    }
    // update doc
    const { acceptUserInvite } = useDocsHandler();
    const doc = await acceptUserInvite(id, user.id, fullShareLink);

    if (!doc) {
        setResponseStatus(event, 500);
        return { error: "Failed to accept share link" };
    }

    // update user
    const { addFileToUser } = useUsersHandler();
    const fileMeta = generateFileMeta(doc);
    await addFileToUser(user.id, fileMeta);
    // redirect to editor
    setResponseStatus(event, 300);
    setHeader(event, 'Location', `/doc/${id}`);
    return { message: "Share link accepted successfully", doc };
});