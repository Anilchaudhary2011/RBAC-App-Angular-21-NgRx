import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthActions, UsersActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  initSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initSession),
      switchMap(() => {
        this.authApi.ensureSeedData();
        const user = this.authApi.restoreSession();
        if (user) {
          this.authApi.persistSession(user);
          return of(AuthActions.initSessionSuccess({ user }));
        }
        return of(AuthActions.initSessionEmpty());
      }),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) => {
        try {
          const user = this.authApi.login(credentials);
          this.authApi.persistSession(user);
          return of(AuthActions.loginSuccess({ user }));
        } catch (error) {
          return of(
            AuthActions.loginFailure({
              error: error instanceof Error ? error.message : 'Login failed.',
            }),
          );
        }
      }),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => void this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ request }) => {
        try {
          const user = this.authApi.register(request);
          this.authApi.persistSession(user);
          return of(AuthActions.registerSuccess({ user }));
        } catch (error) {
          return of(
            AuthActions.registerFailure({
              error: error instanceof Error ? error.message : 'Registration failed.',
            }),
          );
        }
      }),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.authApi.persistSession(null)),
      switchMap(() => of(AuthActions.logoutSuccess())),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => void this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApi = inject(AuthApiService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() => {
        try {
          const users = this.authApi.getAllUsers();
          return of(UsersActions.loadUsersSuccess({ users }));
        } catch (error) {
          return of(
            UsersActions.loadUsersFailure({
              error: error instanceof Error ? error.message : 'Failed to load users.',
            }),
          );
        }
      }),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap(({ request }) => {
        try {
          const user = this.authApi.createUser(request);
          return of(UsersActions.createUserSuccess({ user }));
        } catch (error) {
          return of(
            UsersActions.createUserFailure({
              error: error instanceof Error ? error.message : 'Failed to create user.',
            }),
          );
        }
      }),
    ),
  );
}
