import { Account, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { CredentialInput } from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

export interface SessionParams {
    session: Session;
    user: AdapterUser | User;
    token: JWT;
}

export interface SignInParams {
    user: AdapterUser | User;
    account: Account | null;
    profile?: Profile | undefined;
    email?:
        | {
              verificationRequest?: boolean | undefined;
          }
        | undefined;
    credentials?: Record<string, CredentialInput> | undefined;
}

export interface AuthorizedParams {
    token: JWT | null;
    req: NextRequest;
}
