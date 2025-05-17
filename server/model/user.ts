import { DbEntry } from "./dbEntry";
import { Doc } from "./doc";

export type AuthToken = {
    validTill: Date;
    token: string;
}

export type UserData = {
    name: string;
    token: string;
    authTokens?: AuthToken[];
}

export type User = UserData & DbEntry;

export type FrontendUser = {
    id: string;
    name: string;

    createdAt: Date;
    updatedAt: Date;
}

export const fromUser = (user: User): FrontendUser => {
    return {
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}