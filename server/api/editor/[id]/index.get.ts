import { useDocsHandler } from "~/server/util/docsHandler";
import { useUsersHandler } from "~/server/util/usersHandler";
import * as Y from "yjs";

export default defineEventHandler(async (event) => {
    const { getUserByCookie } = useUsersHandler();
    const user = await getUserByCookie(event);
    // if (!user) {
    //     setResponseStatus(event, 401);
    //     return;
    // }

    const { getDoc } = useDocsHandler();
    const docId = getRouterParam(event, "id");
    if (!docId) {
        setResponseStatus(event, 400);
        return;
    }
    const doc = await getDoc(docId);
    if (!doc) {
        setResponseStatus(event, 404);
        return;
    }
    if (!doc.public && !user) {
        setResponseStatus(event, 401);
        return;
    }
    if (!doc.public && user) {
        // check if user has permission to access the doc
        await useDocsHandler().checkDocPermissions(doc, user);
    }

    setResponseStatus(event, 200);
    return doc;
});