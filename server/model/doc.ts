import * as Y from 'yjs'
import { DbEntry } from './dbEntry';
import { PermissionData } from './permission';

export type DocMeta = {
    name: string;
}

export type DocData = DocMeta & {
    content: string;
    yjs?: Y.Doc;

    // security
    users: PermissionData[]; // user ids
    public?: boolean; // if the document is public

    sharingLink?: string; // link to share the document
};
export type Doc = DbEntry & DocData;
