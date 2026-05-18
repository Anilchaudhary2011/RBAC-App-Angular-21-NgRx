import {
  DestroyRef,
  Directive,
  inject,
  input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Permission } from '../models/permission';
import { selectHasPermission } from '../../store/auth/auth.selectors';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly appHasPermission = input.required<Permission>();

  ngOnInit(): void {
    this.store
      .select(selectHasPermission(this.appHasPermission()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((allowed) => {
        this.viewContainer.clear();
        if (allowed) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
}
