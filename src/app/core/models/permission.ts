import { UserRole } from './user-role';

export enum Permission {
  ViewDashboard = 'view_dashboard',
  ViewContent = 'view_content',
  EditContent = 'edit_content',
  ManageUsers = 'manage_users',
  CreateUsers = 'create_users',
}

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.Admin]: [
    Permission.ViewDashboard,
    Permission.ViewContent,
    Permission.EditContent,
    Permission.ManageUsers,
    Permission.CreateUsers,
  ],
  [UserRole.Editor]: [
    Permission.ViewDashboard,
    Permission.ViewContent,
    Permission.EditContent,
  ],
  [UserRole.Viewer]: [Permission.ViewDashboard, Permission.ViewContent],
};

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function roleHasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => roleHasPermission(role, permission));
}
