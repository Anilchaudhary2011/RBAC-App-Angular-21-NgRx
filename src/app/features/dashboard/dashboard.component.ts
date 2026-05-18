import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewContainerRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Permission } from '../../core/models/permission';
import { USER_ROLE_OPTIONS, UserRole } from '../../core/models/user-role';
import { User } from '../../core/models/user';
import { UsersActions } from '../../store/auth/auth.actions';
import { selectHasPermission } from '../../store/auth/auth.selectors';
import { selectUsers, selectUsersLoading } from '../../store/users/users.selectors';

type RoleCountKey = 'Admin' | 'Editor' | 'Viewer';

const ROLE_CHART_LABELS: RoleCountKey[] = ['Admin', 'Editor', 'Viewer'];
const ROLE_CHART_COLORS = ['#6366f1', '#0ea5e9', '#14b8a6'];

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('modalHost', { read: ViewContainerRef }) private modalHost?: ViewContainerRef;

  readonly canCreateUsers$ = this.store.select(selectHasPermission(Permission.CreateUsers));
  readonly usersLoading$ = this.store.select(selectUsersLoading);
  private readonly users$ = this.store.select(selectUsers);
  readonly roles = USER_ROLE_OPTIONS;
  readonly pageSize = 6;

  readonly chartType = 'doughnut' as const;
  chartData: ChartData<'doughnut'> = {
    labels: [...ROLE_CHART_LABELS],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [...ROLE_CHART_COLORS],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };
  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed ?? 0;
            const total = (ctx.dataset.data as number[]).reduce((sum, n) => sum + n, 0);
            const pct = total ? Math.round((value / total) * 100) : 0;
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  searchTerm = '';
  roleFilter = '';
  currentPage = 1;

  private allUsers: User[] = [];

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());

    this.users$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.allUsers = users;
      this.clampCurrentPage();
      this.updateChartData();
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

  private updateChartData(): void {
    const distribution = this.roleDistribution;
    this.chartData = {
      labels: [...ROLE_CHART_LABELS],
      datasets: [
        {
          data: ROLE_CHART_LABELS.map((role) => distribution[role]),
          backgroundColor: [...ROLE_CHART_COLORS],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }
}
