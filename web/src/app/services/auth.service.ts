import { inject, Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { User } from '../generated/prisma/browser';
import { injectTrpcClient } from '../trpc-client';
import { ProfileService } from './profile.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private trpc = injectTrpcClient();
  private sessionService = inject(SessionService);
  private profileService = inject(ProfileService);

  signInAsAnonymous() {
    return this.trpc.auth.signInAsAnonymous.mutate().pipe(
      tap(({ sessionId, user }) => {
        this.sessionService.set(sessionId);
        this.profileService.set(user as unknown as User);
      })
    );
  }

  signOut() {
    return this.trpc.auth.signOut.mutate().pipe(
      tap(() => {
        this.sessionService.remove();
        this.profileService.remove();
      })
    );
  }

  profile() {
    this.sessionService.reload();
    return this.trpc.auth.profile.query().pipe(
      tap((profile) => {
        this.profileService.set(profile as unknown as User);
        return profile;
      }),
      catchError((err) => {
        this.sessionService.remove();
        this.profileService.remove();
        return of(null);
      })
    );
  }
}
