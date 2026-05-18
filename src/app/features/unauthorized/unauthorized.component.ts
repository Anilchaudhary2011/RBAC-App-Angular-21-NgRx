import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  template: `
    <section class="page centered">
      <h1>Access denied</h1>
      <p>You do not have permission to view this page.</p>
      <a routerLink="/dashboard" class="btn btn-primary">Back to dashboard</a>
    </section>
  `,
  styles: `
    .centered {
      text-align: center;
      padding: 4rem 1rem;
    }
  `,
})
export class UnauthorizedComponent {}
