import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { first, map, of, shareReplay, switchMap, tap } from 'rxjs';

import { DashboardsService } from '../../../services/dashboards.service';

@Component({
  selector: 'dashboards-delete-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyBootstrapModule, AsyncPipe, ReactiveFormsModule],
  template: ` @if (dashboard$ | async; as dashboard) {
    <section class="pico">
      <h3>
        <nav aria-label="breadcrumb">
          <ul>
            <li><a href="/dashboards">Dashboards</a></li>
            <li>
              <a href="/dashboards/{{ dashboard.id }}">{{ dashboard.name }}</a>
            </li>
            <li>Deleting</li>
          </ul>
        </nav>
      </h3>

      <hr />
      <form [formGroup]="form" (ngSubmit)="onSubmit(dashboard.id)">
        Remove dashboard with name "{{ dashboard.name }}" ?

        <div class="grid">
          <a
            href="/dashboards/{{ dashboard.id }}"
            type="button"
            class="secondary"
            >No</a
          >
          <button type="submit">Yes</button>
        </div>
      </form>
      <hr />
    </section>
  }`,
})
export default class DashboardsDeletePageComponent {
  private readonly dashboardsService = inject(DashboardsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form = new UntypedFormGroup({});

  readonly dashboard$ = this.route.paramMap.pipe(
    map(params => params.get('dashboardId')),
    switchMap(dashboardId =>
      dashboardId ? this.dashboardsService.read(dashboardId) : of(null)
    ),
    shareReplay(1)
  );

  onSubmit(dashboardId: string) {
    this.dashboardsService
      .delete(dashboardId)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }
}
