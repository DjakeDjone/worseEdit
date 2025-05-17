import * as Y from 'yjs'
import { DbEntry } from './dbEntry';


export type Doc = DbEntry & {
    name: string;
    content: string;
    yjs: Y.Doc;

    // security
    owners: string[]; // user ids, * for all
    collaborators: string[]; // user ids, * for all
    viewers: string[]; // user ids, * for all

    sharingLink: string; // link to share the document
};