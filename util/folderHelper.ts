import type { FileMeta } from "~/server/model/folder";
import type { FrontendUser, User } from "~/server/model/user";

export type Folder = {
    id: string;
    name: string;
    path: string;
    children: Folder[];
    files: FileMeta[];
}

export const splitExplorer = (user: FrontendUser) => {
    let folders: Folder[] = [];
    let currentFolder: Folder | undefined = undefined;

    user.files?.forEach((file) => {
        const pathParts = file.name.split("/");
        console.log(`Processing file: ${file.name}, path parts: ${JSON.stringify(pathParts)}`);
        
        pathParts.forEach((part, index) => {
            if (part === ""|| part.length<=0) part = "root"; // handle empty parts for root
            currentFolder = getOrCreateFolder(currentFolder?.children??folders, pathParts.slice(0, index + 1));
        });
        if (!currentFolder) {
            throw new Error("Current folder is undefined, this should not happen.");
        }
        // add file to the current folder
        currentFolder!.files.push(file);
        currentFolder = undefined;
    });
    // sort folders and files
    folders.forEach(folder => {
        folder.children.sort((a, b) => a.name.localeCompare(b.name));
        folder.files.sort((a, b) => a.name.localeCompare(b.name));
    })
    folders.sort((a, b) => a.name.localeCompare(b.name));
    return folders;
}

const createFolder = (folderName: string, path: string): Folder => {
    return {
        id: crypto.randomUUID(),
        name: folderName,
        children: [],
        files: [],
        path: path,
    };
}

const getOrCreateFolder = (folders: Folder[], pathParts: string[]): Folder => {
    const folderName = pathParts[pathParts.length - 1];
    let folder = folders.find(f => f.name === folderName);

    if (!folder) {
        folder = createFolder(folderName, pathParts.join("/"));
        folders.push(folder);
    }
    return folder;
};