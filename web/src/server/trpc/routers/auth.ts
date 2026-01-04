import { randomUUID } from 'crypto';

import { z } from 'zod';

import { prisma } from '../../prisma';
import { UserSchema, UserType } from '../../types/UserSchema';
import { SupabaseAuthService, SupabaseSignUpData, SupabaseSignInData } from '../../supabase/auth.service';
import { publicProcedure, router } from '../trpc';

const supabaseAuthService = new SupabaseAuthService();

export const authRouter = router({
  profile: publicProcedure
    .output(UserSchema.nullish())
    .query(async ({ ctx }) => {
      return ctx.user as UserType;
    }),

  signInAsAnonymous: publicProcedure
    .input(
      z
        .object({
          anonymousId: z.string().nullish(),
        })
        .nullish()
    )
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async options => {
      const user = await prisma.user.create({
        data: {
          anonymousId: options?.input?.anonymousId || randomUUID(),
          createdAt: new Date(),
        },
      });
      const session = await prisma.session.create({
        data: { userId: user.id },
      });
      return { sessionId: session.id, user: user as UserType };
    }),

  signOut: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session?.id) {
      await prisma.session.update({
        where: { id: ctx.session?.id },
        data: { deletedAt: new Date(0) },
      });
    }
  }),

  // Supabase Authentication Methods
  supabaseSignUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async ({ input }) => {
      const signUpData: SupabaseSignUpData = {
        email: input.email,
        password: input.password,
        name: input.name,
      };
      
      return await supabaseAuthService.signUp(signUpData);
    }),

  supabaseSignIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async ({ input }) => {
      const signInData: SupabaseSignInData = {
        email: input.email,
        password: input.password,
      };
      
      return await supabaseAuthService.signIn(signInData);
    }),

  supabaseSignInWithOAuth: publicProcedure
    .input(
      z.object({
        provider: z.enum(['google', 'github', 'facebook', 'twitter']),
      })
    )
    .output(z.string()) // Returns redirect URL
    .mutation(async ({ input }) => {
      return await supabaseAuthService.signInWithOAuth(input.provider);
    }),

  supabaseVerifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
        type: z.enum(['signup', 'recovery', 'invite', 'magiclink']),
        email: z.string().email().optional(),
      })
    )
    .output(
      z.object({
        sessionId: z.string().uuid(),
        user: UserSchema,
      })
    )
    .mutation(async ({ input }) => {
      return await supabaseAuthService.verifyEmailToken(input.token, input.type, input.email);
    }),
});

