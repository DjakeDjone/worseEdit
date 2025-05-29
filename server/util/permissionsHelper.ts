// import { Folder } from "../model/folder";
import { Permission, PermissionData } from "../model/permission";

export const getPermissionsDirect = (userId: string, permissions: PermissionData[]): Permission | null => {
    const permission = permissions.find((p) => p.userId === userId);
    if (!permission) {
        return null;
    }
    return permission.permission;
}