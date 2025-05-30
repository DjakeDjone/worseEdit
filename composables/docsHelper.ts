import { type Doc, type DocMeta } from "~/server/model/doc";
import type { FileMeta } from "~/server/model/folder"
import type { Permission } from "~/server/model/permission";
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

    const deleteDoc = async (id: string) => {
        const res = await useNuxtApp().$api<Doc>("/api/editor/" + id, {
            method: "DELETE",
            credentials: "include",
        });
        return res;
    }

    const shareDoc = async (id: string, link: string, permission: Permission, reusable: boolean) => {
        const res = await useNuxtApp().$api<Doc>("/api/editor/" + id + "/share", {
            method: "POST",
            body: {
                permission: JSON.stringify(permission),
                link: link,
                reusable: reusable
            },
            credentials: "include",
        });
        return res;
    }

    const acceptShareLink = async (id: string, permissions: Permission, shareLink: string) => {
        const res = await useNuxtApp().$api<Doc>(`/api/editor/${id}/share/${permissions}/${shareLink}/accept`, {
            method: "POST",
            credentials: "include",
        });
        return res;
    }

    return {
        createDoc,
        deleteDoc,
        shareDoc,
        acceptShareLink
    }
}