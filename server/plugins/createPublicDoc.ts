import { DocMeta } from "../model/doc";
import { useDocsHandler } from "../util/docsHandler";

export default defineNitroPlugin((nitroApp) => {
    const docsHandler = useDocsHandler();

    docsHandler.init();
})
