import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user';
import { AuthActions, UsersActions } from '../auth/auth.actions';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialUsersState,
    on(UsersActions.loadUsers, UsersActions.createUser, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(UsersActions.loadUsersSuccess, (state, { users }) => ({
      ...state,
      users,
      loading: false,
    })),
    on(UsersActions.createUserSuccess, (state, { user }) => ({
      ...state,
      users: [...state.users, user],
      loading: false,
    })),
    on(UsersActions.loadUsersFailure, UsersActions.createUserFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(UsersActions.clearUsersError, (state) => ({
      ...state,
      error: null,
    })),
    on(AuthActions.logoutSuccess, () => initialUsersState),
  ),
});
