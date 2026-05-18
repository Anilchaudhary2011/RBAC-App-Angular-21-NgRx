import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Permission } from '../../../core/models/permission';
import { UserRole } from '../../../core/models/user-role';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, HasPermissionDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly Permission = Permission;
  readonly UserRole = UserRole;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
