import * as Y from 'yjs'


export type Doc = {
    id: number;
    name: string;
    content: string;
    yjs: Y.Doc;
    createdAt: Date;
    updatedAt: Date;
};