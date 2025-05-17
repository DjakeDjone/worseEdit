import { Doc } from "yjs"
import { User } from "../model/user"


export const useDocsHandler = () => {
    const sharedDocs = new Map<string, Doc>();
    const users = new Map<string, User[]>();

    const getDoc = (name: string) => {
        // TODO: security check
        if (!sharedDocs.has(name)) {
            sharedDocs.set(name, new Doc());
        }
        return sharedDocs.get(name);
    }

    return {
        sharedDocs,
        users,
        
        getDoc,
    }
}