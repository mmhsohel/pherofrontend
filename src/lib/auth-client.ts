import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
export const { useSession, signIn, signUp, signOut } = authClient;

export const issueJwt = () =>
  fetch("/api/server-auth/jwt", { method: "POST", credentials: "include" });