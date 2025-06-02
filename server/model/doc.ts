import * as Y from 'yjs'
import { DbEntry } from './dbEntry';
import { Permission, PermissionData } from './permission';
import { DocSettings } from './docSettings';

export type DocMeta = {
    name: string;
}


export type DocData = DocMeta & {
    content: string;
    yjs?: Y.Doc;
    settings: DocSettings;

    // security
    users: PermissionData[]; // user ids
    public?: boolean; // if the document is public

    sharingLinks?: SharingLink[]; // link to share the document
};
export type Doc = DbEntry & DocData;

export type SharingLink = {
    link: string;
    permission: Permission;
    validTill: Date; // when the link expires
    reusable?: boolean;
}

export const DEFAULT_DOC = {
    content: "",
} as Doc;