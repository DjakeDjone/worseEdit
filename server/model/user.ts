import { Doc } from "./doc";

export type User = {
    id: number;
    name: string;
    token: string;

    docs: Doc[];

    createdAt: Date;
    updatedAt: Date;
}