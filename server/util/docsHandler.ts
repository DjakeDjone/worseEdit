import { Doc, DocData, DocMeta, SharingLink } from "../model/doc";
import { User } from "../model/user";
import { generateDbEntry } from "../model/dbEntry";
import * as Y from 'yjs';
import { Permission } from "../model/permission";
import { useUsersHandler } from "./usersHandler";
import { generateFileMeta } from "../model/folder";

export const useDocsHandler = () => {
    const tableName = "docs";
    const db = useStorage("data");
    const userHandler = useUsersHandler();

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
                settings: {}
            });
            newDoc.id = "public";
            await db.setItem(tableName + ":public", newDoc);
        }
    }

    const getDoc = async (id: string) => {
        const doc = await db.getItem<Doc>(tableName + ":" + id);
        // console.log(`getDoc: ${id}: ${doc?.content}`);
        // set yjs
        if (doc && doc.yjs) {
            doc.yjs = new Y.Doc();
            const update = new TextEncoder().encode(doc.content);
            Y.applyUpdate(doc.yjs, update);
            doc.content = doc.yjs.toString();
        }
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
        const newBaseDoc = {
            ...doc,
            content: "<h1>Worse Doc</h1>",
            users: [],
            settings: {},
        } as DocData
        const newDoc: Doc = generateDbEntry<DocData>(id, newBaseDoc);
        if (owner) {
            newDoc.users.push({
                userId: owner.id,
                permission: Permission.ADMIN,
            });
        } else {
            newDoc.public = true;
        }
        await db.setItem(tableName + ":" + id, newDoc);
        // update user
        if (owner) {
            userHandler.addFileToUser(owner.id, generateFileMeta(newDoc));
        }
        return newDoc;
    }

    /// update doc
    /// @param id doc id
    /// @param doc doc object
    /// @returns doc object
    /// @throws Error if doc does not exist
    const updateDoc = async (id: string, doc: DocData) => {
        // check if doc exists
        const existingDoc = getDoc(id);
        // TODO: check permissions
        const updatedDoc = { ...existingDoc, ...doc, updatedAt: new Date() };
        await db.setItem(tableName + ":" + id, updatedDoc);
        // TODO: update user 
        return updatedDoc;
    };

    /// update doc content
    /// @param id doc id
    /// @param content new content as a string (e.g., base64 encoded)
    /// @returns updated doc object
    /// @throws Error if doc does not exist
    const updateDocContent = async (id: string, content: string) => {
        const existingDoc = await db.getItem<Doc>(tableName + ":" + id);
        if (!existingDoc) {
            throw new Error(`Doc with id ${id} does not exist, cannot update content.`);
        }
        const updatedDoc: Doc = {
            ...existingDoc,
            content: content,
            updatedAt: new Date(),
        };
        await db.setItem(tableName + ":" + id, updatedDoc);
        return updatedDoc;
    };

    /// delete doc
    /// @param id doc id
    /// @returns true if successful
    /// @throws Error if doc does not exist
    const deleteDoc = async (id: string, userId: string) => {
        const existingDoc = await getDoc(id);
        if (!existingDoc) {
            throw new Error("Doc does not exist");
        }
        if (!existingDoc.users.some((u) => u.userId === userId && u.permission === Permission.ADMIN)) {
            throw new Error("User does not have permission to delete this document");
        }
        await db.removeItem(tableName + ":" + id);
        // remove from user
        await userHandler.removeFileFromUser(userId, id);
        return true;
    }

    const inviteUserToDoc = async (docId: string, permission: Permission = Permission.READ, link: string, reusable: boolean = true) => {
        const doc = await getDoc(docId);
        if (!doc) {
            throw new Error("Document not found");
        }
        // Add the user to the document's users
        if (!doc.sharingLinks) {
            doc.sharingLinks = [];
        }
        const sharingLink = {
            link: link,
            permission,
            validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // valid for 7 days
            reusable: reusable,
        } as SharingLink;
        doc.sharingLinks.push(sharingLink);
        // Save the updated document
        updateDoc(docId, doc);
        return doc;
    }

    const acceptUserInvite = async (docId: string, userId: string, link: string) => {
        const doc = await getDoc(docId);
        if (!doc) {
            throw new Error("Document not found");
        }
        console.log(`Accepting invite for user ${userId} to doc ${docId} with link ${link}`);

        const sharingLink = doc.sharingLinks?.find(l => l.link === link);
        if (!sharingLink) {
            throw new Error("Invalid sharing link");
        }
        if (sharingLink.validTill < new Date()) {
            throw new Error("Sharing link has expired");
        }
        // Check if user already has access
        if (doc.users.some(u => u.userId === userId)) {
            throw new Error("User already has access to this document");
        }
        // Add user to document
        doc.users.push({
            userId: userId,
            permission: sharingLink.permission,
        });

        if (!sharingLink.reusable) {
            doc.sharingLinks = doc.sharingLinks?.filter(l => l.link !== link);
        }
        await updateDoc(docId, doc);
        return doc;
    }

    const getUserDocs = async (userId: string) => {
        const user = await userHandler.getUserUnsafe(userId);
        if (!user || !user.files) {
            return [];
        }
        const docs: Doc[] = [];
        for (const file of user.files) {
            const doc = await getDoc(file.fileId);
            if (doc) {
                docs.push(doc);
            }
        }
        return docs;
    }

    const deleteUserDocs = async (userId: string) => {
        const user = await userHandler.getUserUnsafe(userId);
        if (!user || !user.files) {
            return;
        }
        for (const file of user.files) {
            try {
                await db.removeItem(tableName + ":" + file.fileId);
            } catch (e) {
                console.error(`Failed to delete doc ${file.fileId}:`, e);
            }
        }
    }


    return {
        init,
        getDoc,
        checkDocPermissions,
        createDoc,
        updateDoc,
        updateDocContent,
        deleteDoc,
        inviteUserToDoc,
        acceptUserInvite,
        getUserDocs,
        deleteUserDocs,
    }
}