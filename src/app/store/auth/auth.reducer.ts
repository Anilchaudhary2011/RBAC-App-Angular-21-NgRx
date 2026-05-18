import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user';
import { AuthActions } from './auth.actions';

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
  initialized: false,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.initSession, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.initSessionSuccess, (state, { user }) => ({
      ...state,
      currentUser: user,
      loading: false,
      initialized: true,
    })),
    on(AuthActions.initSessionEmpty, (state) => ({
      ...state,
      currentUser: null,
      loading: false,
      initialized: true,
    })),
    on(AuthActions.login, AuthActions.register, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { user }) => ({
      ...state,
      currentUser: user,
      loading: false,
      error: null,
      initialized: true,
    })),
    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(AuthActions.logout, (state) => ({
      ...state,
      loading: true,
    })),
    on(AuthActions.logoutSuccess, () => ({
      ...initialAuthState,
      initialized: true,
    })),
    on(AuthActions.clearError, (state) => ({
      ...state,
      error: null,
    })),
  ),
});
