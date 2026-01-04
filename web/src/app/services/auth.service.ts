import { inject, Injectable } from '@angular/core';
import { catchError, concatMap, firstValueFrom, from, switchMap } from 'rxjs';

import { User } from '../generated/prisma/browser';
import { injectTrpcClient } from '../trpc-client';
import { ErrorHandlerService } from './error-handler.service';
import { ProfileService } from './profile.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private trpc = injectTrpcClient();
  private sessionService = inject(SessionService);
  private profileService = inject(ProfileService);
  private errorHandler = inject(ErrorHandlerService);

  signInAsAnonymous() {
    return from(this.sessionService.remove()).pipe(
      concatMap(async () => {
        try {
          const { sessionId, user } = await firstValueFrom(
            this.trpc.auth.signInAsAnonymous.mutate()
          );
          await this.sessionService.set(sessionId);
          await this.profileService.set(user as unknown as User);
          return { sessionId, user };
        } catch (error) {
          await this.errorHandler.handleError(
            error,
            'Failed to sign in as anonymous'
          );
          throw error;
        }
      })
    );
  }

  signOut() {
    return this.trpc.auth.signOut.mutate().pipe(
      concatMap(async result => {
        try {
          await this.sessionService.remove();
          await this.profileService.remove();
          return result;
        } catch (error) {
          await this.errorHandler.handleError(error, 'Failed to sign out');
          throw error;
        }
      })
    );
  }

  profile() {
    return from(this.sessionService.reload()).pipe(
      switchMap(() => this.trpc.auth.profile.query()),
      concatMap(async profile => {
        try {
          await this.profileService.set(profile as unknown as User);
          return profile;
        } catch (error) {
          await this.errorHandler.handleError(error, 'Failed to load profile');
          throw error;
        }
      }),
      catchError(err => {
        console.error(err);
        const func = async () => {
          await this.sessionService.remove();
          await this.profileService.remove();
        };
        return from(func());
      })
    );
  }

  // Supabase Authentication Methods
  supabaseSignUp(email: string, password: string, name?: string) {
    return from(this.sessionService.remove()).pipe(
      concatMap(async () => {
        try {
          const { sessionId, user } = await firstValueFrom(
            this.trpc.auth.supabaseSignUp.mutate({ email, password, name })
          );
          await this.sessionService.set(sessionId);
          await this.profileService.set(user as unknown as User);
          return { sessionId, user };
        } catch (error) {
          await this.errorHandler.handleError(
            error,
            'Failed to sign up with Supabase'
          );
          throw error;
        }
      })
    );
  }

  supabaseSignIn(email: string, password: string) {
    return from(this.sessionService.remove()).pipe(
      concatMap(async () => {
        try {
          const { sessionId, user } = await firstValueFrom(
            this.trpc.auth.supabaseSignIn.mutate({ email, password })
          );
          await this.sessionService.set(sessionId);
          await this.profileService.set(user as unknown as User);
          return { sessionId, user };
        } catch (error) {
          await this.errorHandler.handleError(
            error,
            'Failed to sign in with Supabase'
          );
          throw error;
        }
      })
    );
  }

  supabaseSignInWithOAuth(provider: 'google' | 'github' | 'facebook' | 'twitter') {
    return firstValueFrom(
      this.trpc.auth.supabaseSignInWithOAuth.mutate({ provider })
    ).then(redirectUrl => {
      // Redirect to the OAuth provider
      window.location.href = redirectUrl;
    });
  }

  supabaseVerifyEmail(token: string, type: 'signup' | 'recovery' | 'invite' | 'magiclink', email?: string) {
    return from(this.sessionService.remove()).pipe(
      concatMap(async () => {
        try {
          const { sessionId, user } = await firstValueFrom(
            this.trpc.auth.supabaseVerifyEmail.mutate({ token, type, email })
          );
          await this.sessionService.set(sessionId);
          await this.profileService.set(user as unknown as User);
          return { sessionId, user };
        } catch (error) {
          await this.errorHandler.handleError(
            error,
            'Failed to verify email with Supabase'
          );
          throw error;
        }
      })
    );
  }
}
