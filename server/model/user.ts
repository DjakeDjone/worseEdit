import { DbEntry } from "./dbEntry";
import { Doc } from "./doc";
import * as Y from "yjs";

export type AuthToken = {
    validTill: Date;
    token: string;
}

export type UserData = {
    name: string;
    token: string;
    authTokens?: AuthToken[];
    // 
    docs?: String[]; // doc ids, great for searching etc. !redundant!
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

export const beautifulColorFromName = (name: string) => {
    const hash = name.split("").reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0);
    const hue = hash % 360;
    const saturation = 70;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const toYUser = (user: User) => {
    return {
        name: user.name,
        color: beautifulColorFromName(user.name),
    }
}

export const fakeUser: User = {
    id: "1234",
    name: "THE WORST",
    token: "xxx",
    createdAt: new Date(),
    updatedAt: new Date(),
}
