import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
export const { useSession, signIn, signUp, signOut } = authClient;

// Call after every successful login (email or Google) to get the HTTPOnly JWT cookie
export const issueJwt = () =>
  fetch("/api/server-auth/jwt", { method: "POST", credentials: "include" });