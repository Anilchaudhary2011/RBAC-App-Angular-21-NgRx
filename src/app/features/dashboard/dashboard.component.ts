import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { Permission, ROLE_PERMISSIONS } from '../../core/models/permission';
import { USER_ROLE_OPTIONS, UserRole } from '../../core/models/user-role';
import { User } from '../../core/models/user';
import { UsersActions } from '../../store/auth/auth.actions';
import { selectCurrentUser, selectCurrentRole, selectHasPermission } from '../../store/auth/auth.selectors';
import { selectUsers, selectUsersLoading } from '../../store/users/users.selectors';

type RoleCountKey = 'Admin' | 'Editor' | 'Viewer';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('chartCanvas') private chartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalHost', { read: ViewContainerRef }) private modalHost?: ViewContainerRef;

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly currentRole$ = this.store.select(selectCurrentRole);
  readonly canManageUsers$ = this.store.select(selectHasPermission(Permission.ManageUsers));
  readonly users$ = this.store.select(selectUsers);
  readonly usersLoading$ = this.store.select(selectUsersLoading);
  readonly rolePermissions = ROLE_PERMISSIONS;
  readonly UserRole = UserRole;
  readonly Permission = Permission;
  readonly roles = USER_ROLE_OPTIONS;
  readonly pageSize = 6;

  searchTerm = '';
  roleFilter = '';
  currentPage = 1;
  isChartLoading = true;

  private allUsers: User[] = [];
  private chartReady = false;

  ngOnInit(): void {
    this.canManageUsers$
      .pipe(filter(Boolean), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.store.dispatch(UsersActions.loadUsers()));

    this.users$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.allUsers = users;
      this.clampCurrentPage();
      if (this.chartReady) {
        this.drawRoleChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.canManageUsers$
      .pipe(filter(Boolean), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        setTimeout(() => {
          this.isChartLoading = false;
          this.drawRoleChart();
          this.chartReady = true;
        }, 350);
      });
  }

  get totalUsers(): number {
    return this.allUsers.length;
  }

  get roleDistribution(): Record<RoleCountKey, number> {
    const distribution: Record<RoleCountKey, number> = {
      Admin: 0,
      Editor: 0,
      Viewer: 0,
    };
    for (const user of this.allUsers) {
      distribution[user.role as RoleCountKey] += 1;
    }
    return distribution;
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.allUsers.filter((user) => {
      const matchesSearch =
        !term ||
        user.displayName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  onRoleFilterChange(value: string): void {
    this.roleFilter = value;
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  trackById(_index: number, user: User): string {
    return user.id;
  }

  getRoleBadgeClass(role: UserRole): string {
    return `role-badge role-badge--${role.toLowerCase()}`;
  }

  async openAddUserModal(): Promise<void> {
    if (!this.modalHost) {
      return;
    }
    this.modalHost.clear();
    const { AddUserModalComponent } = await import('./add-user-modal/add-user-modal.component');
    const ref = this.modalHost.createComponent(AddUserModalComponent);
    ref.instance.closed.subscribe(() => ref.destroy());
    ref.instance.created.subscribe(() => ref.destroy());
  }

  private clampCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  private drawRoleChart(): void {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const distribution = this.roleDistribution;
    const values = [
      { label: 'Admin', value: distribution.Admin, color: '#6366f1' },
      { label: 'Editor', value: distribution.Editor, color: '#0ea5e9' },
      { label: 'Viewer', value: distribution.Viewer, color: '#14b8a6' },
    ];
    const total = values.reduce((sum, item) => sum + item.value, 0);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const size = 220;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = 78;
    const innerRadius = 48;

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.font = '13px Segoe UI, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No users yet', center, center + 4);
      return;
    }

    let startAngle = -Math.PI / 2;
    for (const segment of values) {
      if (!segment.value) {
        continue;
      }
      const slice = (segment.value / total) * Math.PI * 2;
      const endAngle = startAngle + slice;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      startAngle = endAngle;
    }

    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 22px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(total), center, center - 2);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Segoe UI, system-ui, sans-serif';
    ctx.fillText('users', center, center + 16);
  }
}
