import { inject, provideAppInitializer } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom } from 'rxjs';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectAuthInitialized } from '../../store/auth/auth.selectors';

export function provideAuthInitializer() {
  return provideAppInitializer(() => {
    const store = inject(Store);
    store.dispatch(AuthActions.initSession());
    return firstValueFrom(
      store.select(selectAuthInitialized).pipe(filter((initialized) => initialized)),
    );
  });
}
