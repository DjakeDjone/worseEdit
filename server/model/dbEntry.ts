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

// converts createdAt and updatedAt from string to Date
type ApiEntry<T> = Omit<T, 'createdAt' | 'updatedAt'> &{
    id: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};

export const convertDbEntryFromApi = <T extends {}> (data: ApiEntry<T>): DbEntry & Omit<T, 'createdAt' | 'updatedAt'> => {
    return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        id: data.id,
    }
}