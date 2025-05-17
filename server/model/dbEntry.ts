export type DbEntry = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export const generateDbEntry = <T extends {}>(id: string, data: T): DbEntry & T => {
    return {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
    }
}