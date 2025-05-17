import { useDocsHandler } from "~/server/util/docsHandler";
import { useUsersHandler } from "~/server/util/userHandler";

export default defineEventHandler(async (event) => {
    const { getUserByCookie } = useUsersHandler();
    const user = await getUserByCookie(event);
    if (!user) {
        setResponseStatus(event, 401);
        return;
    }

    const { getDoc } = useDocsHandler();
    const docName = getRouterParam(event, "name");
    if (!docName) {
        setResponseStatus(event, 400);
        return;
    }
    const doc = await getDoc(docName);
    if (!doc) {
        setResponseStatus(event, 404);
        return;
    }
    // check if user has permission to access the doc
    await useDocsHandler().checkDocPermissions(doc, user);

    setResponseStatus(event, 200);
    return doc;
});