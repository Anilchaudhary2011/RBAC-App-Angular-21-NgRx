import { EnvironmentProviders, isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authFeature } from './auth/auth.reducer';
import { AuthEffects, UsersEffects } from './auth/auth.effects';
import { usersFeature } from './users/users.reducer';

export function provideAppStore(): EnvironmentProviders[] {
  return [
    provideStore(),
    provideState(authFeature),
    provideState(usersFeature),
    provideEffects(AuthEffects, UsersEffects),
    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
    }),
  ];
}
