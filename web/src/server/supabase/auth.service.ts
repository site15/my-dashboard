import { createSupabaseServerClient } from './supabase';
import { prisma } from '../prisma';
import { UserType } from '../types/UserSchema';

export interface SupabaseAuthResult {
  user: UserType;
  sessionId: string;
}

export interface SupabaseSignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SupabaseSignInData {
  email: string;
  password: string;
}

export class SupabaseAuthService {
  private supabase = createSupabaseServerClient();

  async signUp(signUpData: SupabaseSignUpData): Promise<SupabaseAuthResult> {
    const { email, password, name } = signUpData;

    // Sign up user with Supabase
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new Error(`Supabase sign up failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user returned from Supabase sign up');
    }

    // Create or update user in our database
    const user = await this.createOrUpdateUser(data.user, name);

    // Create session in our database
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    return { user: user as UserType, sessionId: session.id };
  }

  async signIn(signInData: SupabaseSignInData): Promise<SupabaseAuthResult> {
    const { email, password } = signInData;

    // Sign in user with Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Supabase sign in failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user returned from Supabase sign in');
    }

    // Create or update user in our database
    const user = await this.createOrUpdateUser(data.user);

    // Create session in our database
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    return { user: user as UserType, sessionId: session.id };
  }

  async signInWithOAuth(
    provider: 'google' | 'github' | 'facebook' | 'twitter'
  ) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.MY_DASHBOARD_API_URL || 'http://localhost:5173',
      },
    });

    if (error) {
      throw new Error(`Supabase OAuth sign in failed: ${error.message}`);
    }

    return data.url; // This is the URL to redirect the user to
  }

  async verifyToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user returned from token verification');
    }

    // Create or update user in our database
    const user = await this.createOrUpdateUser(data.user);

    // Create session in our database
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    return { user: user as UserType, sessionId: session.id };
  }

  async verifyEmailToken(
    token: string,
    type: 'signup' | 'recovery' | 'invite' | 'magiclink',
    email?: string
  ) {
    let verifyParams;

    if (type === 'signup' || type === 'magiclink') {
      // For signup and magiclink, we need the email
      if (!email) {
        throw new Error(
          'Email is required for signup and magiclink verification'
        );
      }
      verifyParams = {
        email,
        token,
        type,
      };
    } else {
      // For recovery and invite
      verifyParams = {
        token,
        type,
      };
    }

    const { data, error } = await this.supabase.auth.verifyOtp(verifyParams);

    if (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user returned from email verification');
    }

    // Create or update user in our database
    const user = await this.createOrUpdateUser(data.user);

    // Create session in our database
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    return { user: user as UserType, sessionId: session.id };
  }

  async signOut(sessionId: string) {
    // First, get the session to find the user
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Update session to mark as deleted (soft delete)
    await prisma.session.update({
      where: { id: sessionId },
      data: { deletedAt: new Date() },
    });

    // Optionally, sign out from Supabase as well
    // Note: This would require a user access token, which we don't store
    // So we just handle the session in our own database
  }

  private async createOrUpdateUser(supabaseUser: any, name?: string) {
    // Check if user already exists in our database using the Supabase user ID
    let user = await prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.id },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          supabaseUserId: supabaseUser.id,
          supabaseUserData: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name:
              name ||
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split('@')[0] ||
              '',
            aud: supabaseUser.aud,
            role: supabaseUser.role,
            emailConfirmedAt: supabaseUser.email_confirmed_at,
            createdAt: supabaseUser.created_at,
            updatedAt: supabaseUser.updated_at,
          },
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          supabaseUserId: supabaseUser.id,
          supabaseUserData: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name:
              name ||
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split('@')[0] ||
              '',
            aud: supabaseUser.aud,
            role: supabaseUser.role,
            emailConfirmedAt: supabaseUser.email_confirmed_at,
            createdAt: supabaseUser.created_at,
            updatedAt: supabaseUser.updated_at,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return user;
  }
}
