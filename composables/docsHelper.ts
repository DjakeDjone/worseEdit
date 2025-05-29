import { type Doc, type DocMeta } from "~/server/model/doc";
import type { FileMeta } from "~/server/model/folder"
import type { User } from "~/server/model/user"

export const useDocHelper = () => {
    const createDoc = async (docMeta: DocMeta, user: User) => {
        const res = await useNuxtApp().$api<Doc>("/api/editor/create", {
            method: "POST",
            body: docMeta,
            credentials: "include",
        });
        return res;
    }

    return {
        createDoc,
    }
}