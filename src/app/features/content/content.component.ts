import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Permission } from '../../core/models/permission';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { selectHasPermission } from '../../store/auth/auth.selectors';

const DEFAULT_CONTENT =
  'Welcome to the shared content workspace. Editors and Admins can update this text.';

@Component({
  selector: 'app-content',
  imports: [ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly Permission = Permission;
  readonly canEdit = toSignal(this.store.select(selectHasPermission(Permission.EditContent)), {
    initialValue: false,
  });

  readonly content = signal(
    localStorage.getItem('rbac_content') ?? DEFAULT_CONTENT,
  );

  readonly editForm = this.fb.nonNullable.group({
    body: [this.content()],
  });

  save(): void {
    const body = this.editForm.getRawValue().body.trim();
    this.content.set(body);
    localStorage.setItem('rbac_content', body);
  }
}
