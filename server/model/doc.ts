import * as Y from 'yjs'
import { DbEntry } from './dbEntry';

export type DocData = {
    name: string;
    content: string;
    yjs: Y.Doc;

    // security
    users: DocPermissionData[]; // user ids

    sharingLink: string; // link to share the document
};
export type Doc = DbEntry & DocData;

export enum DocPermission {
    READ = 'read',
    WRITE = 'write',
    ADMIN = 'admin',
}

export type DocPermissionData = {
    userId: string;
    permission: DocPermission;
    from?: string; // anchor for the permission
    to?: string; // anchor for the permission 
}