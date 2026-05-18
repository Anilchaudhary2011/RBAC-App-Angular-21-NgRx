import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { Permission } from '../models/permission';
import { selectHasPermission } from '../../store/auth/auth.selectors';

export function permissionGuard(requiredPermission: Permission): CanActivateFn {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectHasPermission(requiredPermission)).pipe(
      take(1),
      map((allowed) => (allowed ? true : router.createUrlTree(['/unauthorized']))),
    );
  };
}
