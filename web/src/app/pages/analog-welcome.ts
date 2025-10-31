import { waitFor } from '@analogjs/trpc';
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { first, of, shareReplay, Subject, switchMap, take, tap } from 'rxjs';
import { TelegramUserDataType } from '../../server/types/TelegramUserDataSchema';
import { LOCAL_STORAGE } from '../browser/local-storage';
import { NgxTelegramWidgetComponent } from '../components/telegram/ngx-telegram-widget.component';
import { injectTrpcClient } from '../trpc-client';

@Component({
  imports: [
    AsyncPipe,
    FormsModule,
    NgFor,
    DatePipe,
    NgxTelegramWidgetComponent,
    NgIf,
    JsonPipe,
  ],
  selector: 'app-analog-welcome',
  styles: [
    `
      :host {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
          'Noto Color Emoji';
        display: flex;
        padding: 2rem 1rem 8rem;
        flex-direction: column;
        background: rgb(250 250 250);
        height: 100%;
      }
      a {
        color: inherit;
        text-decoration: inherit;
      }
      .main {
        margin: 0 auto;
        flex: 1 1 0;
      }
      .intro-section {
        padding-top: 1.5rem;
        padding-bottom: 2rem;
      }
      .intro-section > * + * {
        margin-top: 1.5rem;
      }
      @media (min-width: 768px) {
        .intro-section {
          padding-top: 2.5rem;
          padding-bottom: 3rem;
        }
      }
      @media (min-width: 1024px) {
        .intro-section {
          padding-top: 8rem;
          padding-bottom: 8rem;
        }
      }
      .intro-container {
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        align-items: center;
        max-width: 64rem;
      }
      .intro-logo {
        height: 3rem;
        width: 3rem;
      }
      .intro-badge {
        transition-property: color, background-color, border-color,
          text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        padding: 0.375rem 1rem;
        background-color: rgb(228 228 231);
        border-radius: 1rem;
      }
      .intro-heading {
        margin: 0;
        font-weight: 500;
      }

      @media (min-width: 640px) {
        .intro-heading {
          font-size: 3rem;
          line-height: 1;
        }
      }
      @media (min-width: 768px) {
        .intro-heading {
          font-size: 3.75rem;
          line-height: 1;
        }
      }
      @media (min-width: 1024px) {
        .intro-heading {
          font-size: 4.5rem;
          line-height: 1;
        }
      }
      .intro-analog {
        color: #dd0031;
      }
      .intro-description {
        line-height: 1.5;
        max-width: 42rem;
        margin: 0;
      }

      @media (min-width: 640px) {
        .intro-description {
          line-height: 2rem;
          font-size: 1.25rem;
        }
      }
      .btn-container > * + * {
        margin-left: 1rem;
      }
      .darkBtn {
        transition-property: color, background-color, border-color,
          text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        color: rgb(250 250 250);
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        padding-left: 2rem;
        padding-right: 2rem;
        background-color: rgb(9 9 11);
        border-radius: 0.375rem;
        justify-content: center;
        align-items: center;
        height: 2.75rem;
        cursor: pointer;
        display: inline-flex;
      }
      .darkBtn:hover {
        background-color: rgb(9 9 11 / 0.9);
      }
      .lightBtn {
        transition-property: color, background-color, border-color,
          text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        color: rgb(24, 24, 27);
        background: rgb(250 250 250);
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        padding-left: 2rem;
        padding-right: 2rem;
        border-radius: 0.375rem;
        border: 1px solid rgb(229, 231, 235);
        justify-content: center;
        align-items: center;
        height: 2.75rem;
        display: inline-flex;
        cursor: pointer;
      }
      .lightBtn:hover {
        background-color: rgb(244 244 245);
      }
      .counter-section {
        padding-top: 2rem;
        padding-bottom: 2rem;
      }

      @media (min-width: 768px) {
        .counter-section {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
      }

      @media (min-width: 1024px) {
        .counter-section {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
      }
      .counter-container {
        text-align: center;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 58rem;
        display: flex;
        margin-left: auto;
        margin-right: auto;
      }
      .counter-heading {
        color: #dd0031;
        line-height: 1.1;
        font-weight: 500;
        font-size: 1.875rem;
        margin: 0;
      }
      .counter-description {
        line-height: 1.5;
        max-width: 85%;
        margin: 0;
      }

      @media (min-width: 640px) {
        .counter-description {
          line-height: 1.75rem;
          font-size: 1.125rem;
        }
      }
      .count {
        margin-left: 0.25rem;
        font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
          monospace;
      }
    `,
  ],
  template: `
    <main class="main">
      <section class="intro-section">
        <div class="intro-container">
          <img
            class="intro-logo"
            src="https://analogjs.org/img/logos/analog-logo.svg"
            alt="AnalogJs logo. Two red triangles and a white analog wave in front"
          />
          <a
            class="intro-badge"
            target="_blank"
            href="https://twitter.com/analogjs"
            >Follow along on Twitter</a
          >
          <h1 class="intro-heading">
            <span class="intro-analog">Analog.</span> The fullstack Angular
            meta-framework
          </h1>
          <p class="intro-description">
            Analog is for building applications and websites with Angular.
            <br />Powered by Vite.
          </p>
          <div class="btn-container">
            @if (profile$|async;as profile){
            {{ profile | json }}
            <br />
            <a class="darkBtn" (click)="onSignOut()">Sign-out</a>
            } @else{ @if (telegramSettings$|async;as telegramSettings) {
            <ngx-telegram-widget
              ngSkipHydration
              [botName]="telegramSettings.authBotName"
              (onAuth)="onTelegramLogin($event)"
            ></ngx-telegram-widget>
            } }
          </div>
        </div>
      </section>
      <section id="counter-demo" class="section">
        <div class="counter-container">
          <h2 class="counter-heading">Counter</h2>
          <p class="counter-description">
            This is a simple interactive counter. Powered by Angular.
          </p>
          <button (click)="increment()" class="lightBtn">
            Counter: <span class="count">{{ count }}</span>
          </button>
        </div>
      </section>

      <section id="trpc-demo" class="py-8 md:py-12 lg:py-24">
        <div
          class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
        >
          <h2 class="text-[#DD0031] font-medium text-3xl leading-[1.1]">
            Leave a user
          </h2>
          <p class="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            This is an example of how to you can use tRPC to superpower you
            client server interaction.
          </p>
        </div>
        <form
          class="mt-8 pb-2 flex items-center"
          #f="ngForm"
          (ngSubmit)="addUser(f)"
        >
          <label class="sr-only" for="newUser"> User </label>
          <input
            required
            autocomplete="off"
            name="newUser"
            [(ngModel)]="newUserExternalId"
            class="w-full inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:text-zinc-950 h-11 px-2 rounded-md"
          />
          <button
            class="ml-2 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-zinc-100 hover:text-zinc-950 h-11 px-8 rounded-md"
          >
            +
          </button>
        </form>
        <div class="mt-4" *ngIf="users$ | async as users; else loading">
          <div
            class="user mb-4 p-4 font-normal border border-input rounded-md"
            *ngFor="let user of users; trackBy: userTrackBy; let i = index"
          >
            <div class="flex items-center justify-between">
              <p class="text-sm text-zinc-400">{{ user.createdAt | date }}</p>
              <button
                [attr.data-testid]="'removeUserAtIndexBtn' + i"
                class="text-xs inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-zinc-100 hover:text-zinc-950 h-6 w-6 rounded-md"
                (click)="removeUser(user.id)"
              >
                x
              </button>
            </div>
            <p class="mb-4">{{ user.telegramUserId }}</p>
          </div>

          <div
            class="no-users text-center rounded-xl p-20"
            *ngIf="users.length === 0"
          >
            <h3 class="text-xl font-medium">No users yet!</h3>
            <p class="text-zinc-400">
              Add a new one and see them appear here...
            </p>
          </div>
        </div>
        <ng-template #loading>
          <p class="text-center mt-4">Loading...</p>
        </ng-template>
      </section>
    </main>
  `,
})
export class AnalogWelcome {
  private _trpc = injectTrpcClient();

  count = 0;
  public triggerRefresh$ = new Subject<void>();
  public telegramSettings$ = this.triggerRefresh$.pipe(
    switchMap(() => this._trpc.telegram.settings.query()),
    // tap((settings) => WINDOW['Telegram'].),
    shareReplay(1)
  );
  public profile$ = this.triggerRefresh$.pipe(
    switchMap(() => {
      const sessionId = LOCAL_STORAGE?.getItem('sessionId');
      if (sessionId) {
        return this._trpc.auth.profile.query({
          sessionId,
        });
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  public users$ = this.triggerRefresh$.pipe(
    switchMap(() => this._trpc.users.list.query()),
    shareReplay(1)
  );
  public newUserExternalId = '';

  constructor() {
    void waitFor(this.users$);
    void waitFor(this.telegramSettings$);
    void waitFor(this.profile$);
    this.triggerRefresh$.next();
  }

  public userTrackBy = (index: number, user: any) => {
    return user.createdAt;
  };

  public addUser(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.users.create
      .mutate({ externalId: this.newUserExternalId })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
    this.newUserExternalId = '';
    form.form.reset();
  }

  public removeUser(id: string) {
    this._trpc.users.remove
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }

  increment() {
    this.count++;
  }

  onSignOut() {
    LOCAL_STORAGE?.removeItem('sessionId');
    this.triggerRefresh$.next();
  }

  onTelegramLogin(telegramUser: unknown) {
    console.log({ telegramUser });
    this._trpc.telegram.signIn
      .mutate(telegramUser as TelegramUserDataType)
      .pipe(
        first(),
        tap((result) => {
          LOCAL_STORAGE?.setItem('sessionId', result.sessionId);
          this.triggerRefresh$.next();
        })
      )
      .subscribe();
  }
}
