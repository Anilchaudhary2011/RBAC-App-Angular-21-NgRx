import { createSelector } from '@ngrx/store';
import { Permission, roleHasPermission } from '../../core/models/permission';
import { UserRole } from '../../core/models/user-role';
import { authFeature } from './auth.reducer';

export const {
  selectAuthState,
  selectCurrentUser,
  selectLoading: selectAuthLoading,
  selectError: selectAuthError,
  selectInitialized: selectAuthInitialized,
} = authFeature;

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => user !== null,
);

export const selectCurrentRole = createSelector(
  selectCurrentUser,
  (user) => user?.role ?? null,
);

export const selectHasPermission = (permission: Permission) =>
  createSelector(selectCurrentRole, (role) =>
    role ? roleHasPermission(role, permission) : false,
  );

export const selectHasRole = (...roles: UserRole[]) =>
  createSelector(selectCurrentRole, (role) => (role ? roles.includes(role) : false));

export const selectIsAdmin = selectHasRole(UserRole.Admin);
