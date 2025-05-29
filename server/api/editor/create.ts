import { DocData, DocMeta } from "~/server/model/doc";
import { useDocsHandler } from "~/server/util/docsHandler";
import { useUsersHandler } from "~/server/util/usersHandler";

export default defineEventHandler(async (event) => {
    const body = await readBody<DocMeta>(event);
    const { getUserByCookie } = useUsersHandler();
    const user = await getUserByCookie(event);
    if (!user) {
        console.warn("Unauthorized access attempt to create doc");
        
        setResponseStatus(event, 401);
        return;
    }

    const docsHandler = useDocsHandler();
    const doc = await docsHandler.createDoc(body, user);
    if (!doc) {
        setResponseStatus(event, 500);
        return;
    }
    setResponseStatus(event, 200);
    // setHeader(event, "Location", `/api/editor/${doc.id}`);
    return doc;
});