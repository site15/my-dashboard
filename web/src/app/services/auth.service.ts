import { inject, Injectable } from '@angular/core';
import {
  catchError,
  concatMap,
  firstValueFrom,
  from,
  mergeMap,
  of,
  tap,
} from 'rxjs';
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
    return from(this.sessionService.remove()).pipe(
      concatMap(async () => {
        const { sessionId, user } = await firstValueFrom(
          this.trpc.auth.signInAsAnonymous.mutate()
        );
        await this.sessionService.set(sessionId);
        await this.profileService.set(user as unknown as User);
        return { sessionId, user };
      })
    );
  }

  signOut() {
    return this.trpc.auth.signOut.mutate().pipe(
      concatMap(async (result) => {
        await this.sessionService.remove();
        await this.profileService.remove();
        return result;
      })
    );
  }

  profile() {
    return from(this.sessionService.reload()).pipe(
      mergeMap(() => this.trpc.auth.profile.query()),
      concatMap(async (profile) => {
        await this.profileService.set(profile as unknown as User);
        return profile;
      }),
      catchError((err) => {
        console.error(err);
        const func = async () => {
          await this.sessionService.remove();
          await this.profileService.remove();
        };
        return from(func());
      })
    );
  }
}
