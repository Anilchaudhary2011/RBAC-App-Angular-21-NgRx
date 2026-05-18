import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Permission, ROLE_PERMISSIONS } from '../../core/models/permission';
import { UserRole } from '../../core/models/user-role';
import { selectCurrentUser, selectCurrentRole } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly currentRole$ = this.store.select(selectCurrentRole);
  readonly rolePermissions = ROLE_PERMISSIONS;
  readonly UserRole = UserRole;
  readonly Permission = Permission;
}
