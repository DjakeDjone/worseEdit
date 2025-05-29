import { DbEntry } from "./dbEntry";
import { Doc, DocData } from "./doc";
import { PermissionData } from "./permission";



// export type FolderMeta = {
//     name: string;
//     description?: string;
//     path: string;

//     permissions: PermissionData[];
// }

// export type Folder = FolderMeta & DbEntry;


export type FileMeta = {
    name: string;
    description?: string;
    permissions: PermissionData[];
    fileId: string;
    lastEdited?: Date; // optional, for sorting
}

export const generateFileMeta = (file: Doc) => {
    return {
        name: file.name,
        description: "",
        permissions: file.users,
        fileId: file.id,
        lastEdited: file.updatedAt,
    } satisfies FileMeta;
}