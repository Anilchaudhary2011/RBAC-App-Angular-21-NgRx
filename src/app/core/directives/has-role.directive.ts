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
import { UserRole } from '../models/user-role';
import { selectHasRole } from '../../store/auth/auth.selectors';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  readonly appHasRole = input.required<UserRole[]>();

  ngOnInit(): void {
    this.store
      .select(selectHasRole(...this.appHasRole()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((allowed) => {
        this.viewContainer.clear();
        if (allowed) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }
}
