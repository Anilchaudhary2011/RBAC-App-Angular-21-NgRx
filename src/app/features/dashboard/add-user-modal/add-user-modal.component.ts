import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { USER_ROLE_OPTIONS, UserRole } from '../../../core/models/user-role';
import { UsersActions } from '../../../store/auth/auth.actions';
import { selectUsersError, selectUsersLoading } from '../../../store/users/users.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-user-modal',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
})
export class AddUserModalComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly closed = output<void>();
  readonly created = output<void>();

  readonly loading$ = this.store.select(selectUsersLoading);
  readonly error$ = this.store.select(selectUsersError);
  readonly roleOptions = USER_ROLE_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.Viewer, Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(UsersActions.clearUsersError());
    this.store.dispatch(UsersActions.createUser({ request: this.form.getRawValue() }));
    this.created.emit();
  }

  dismiss(): void {
    this.store.dispatch(UsersActions.clearUsersError());
    this.closed.emit();
  }
}
