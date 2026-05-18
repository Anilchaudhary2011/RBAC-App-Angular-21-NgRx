import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { USER_ROLE_OPTIONS, UserRole } from '../../core/models/user-role';
import { Permission } from '../../core/models/permission';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { UsersActions } from '../../store/auth/auth.actions';
import { selectUsers, selectUsersError, selectUsersLoading } from '../../store/users/users.selectors';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, AsyncPipe, HasPermissionDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly users$ = this.store.select(selectUsers);
  readonly loading$ = this.store.select(selectUsersLoading);
  readonly error$ = this.store.select(selectUsersError);
  readonly roleOptions = USER_ROLE_OPTIONS;
  readonly Permission = Permission;

  readonly createForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.Viewer, Validators.required],
  });

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  createUser(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(UsersActions.clearUsersError());
    this.store.dispatch(UsersActions.createUser({ request: this.createForm.getRawValue() }));
    this.createForm.reset({ role: UserRole.Viewer });
  }
}
