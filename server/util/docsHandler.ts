import { Doc, DocData, DocMeta, DocPermission } from "../model/doc";
import { User } from "../model/user";
import { generateDbEntry } from "../model/dbEntry";


export const useDocsHandler = () => {
    const tableName = "docs";
    const db = useStorage("data");

    const init = async () => {
        // create 'public' file if not exists
        const publicDocFile: DocMeta = {
            name: "public",
        }
        const publicDoc = await db.getItem<Doc>(tableName + ":public");
        if (!publicDoc) {
            const newDoc = generateDbEntry<DocData>("public", {
                ...publicDocFile,
                content: "",
                users: [],
                public: true,
            });
            newDoc.id = "public";
            await db.setItem(tableName + ":public", newDoc);
        }
    }

    const getDoc = async (id: string) => {
        const doc = await db.getItem<Doc>(tableName + ":" + id);
        return doc;
    }

    const checkDocPermissions = async (doc: Doc, user: User) => {
        // check if user is in doc
        const userPermission = doc.users.find((u) => u.userId === user.id);
        if (!userPermission) {
            throw new Error("User does not have permission to access this document");
        }
        return userPermission;
    }


    /// create a new doc
    /// @param doc doc object
    /// @param owner user object, if not provided, doc will be public
    /// @returns doc object
    /// @throws Error if doc already exists
    const createDoc = async (doc: DocMeta, owner?: User) => {
        const id = crypto.randomUUID();
        const newDoc = generateDbEntry<DocData>(id, {
            ...doc,
            content: "",
            users: [],
        });
        if (owner) {
            newDoc.users.push({
                userId: owner.id,
                permission: DocPermission.ADMIN,
            });
        } else {
            newDoc.public = true;
        }
        await db.setItem(tableName + ":" + id, newDoc);
        return newDoc;
    }

    /// update doc
    /// @param id doc id
    /// @param doc doc object
    /// @returns doc object
    /// @throws Error if doc does not exist
    const updateDoc = async (id: string, doc: DocData) => {
        // check if doc exists
        const existingDoc = await db.getItem<Doc>(tableName + id);
        if (!existingDoc) {
            throw new Error("Doc does not exist");
        }
        const updatedDoc = { ...existingDoc, ...doc, updatedAt: new Date() };
        await db.setItem(tableName + ":" + id, updatedDoc);
        return updatedDoc;
    }

    /// delete doc
    /// @param id doc id
    /// @returns true if successful
    /// @throws Error if doc does not exist
    const deleteDoc = async (id: string) => {
        const existingDoc = await db.getItem<Doc>(tableName + id);
        if (!existingDoc) {
            throw new Error("Doc does not exist");
        }
        await db.removeItem(tableName + ":" + id);
        return true;
    }


    return {
        init,
        getDoc,
        checkDocPermissions,
        createDoc,
        updateDoc,
        deleteDoc,
    }
}