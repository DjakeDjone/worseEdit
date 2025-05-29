
export enum Permission {
    READ = 'read',
    WRITE = 'write',
    ADMIN = 'admin',
}

export type PermissionData = {
    userId: string;
    permission: Permission;
    from?: string; // anchor for the permission
    to?: string; // anchor for the permission 
}