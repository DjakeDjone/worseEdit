import { DocMeta } from "../model/doc";
import { useDocsHandler } from "../util/docsHandler";

export default defineNitroPlugin((nitroApp) => {
    const docsHandler = useDocsHandler();

    // crete doc file
    const publicDocFile: DocMeta = {
        name: "worse",
    }

    docsHandler.createDoc(publicDocFile);
})
