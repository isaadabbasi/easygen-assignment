export const APIRoutes = {
  SignIn: "/api/sign-in",
  SignUp: "/api/sign-up",
  SignOut: "/api/sign-out",
  RefreshToken: "/api/refresh-token",
  Protected: "/api/protected",
} as const;

export const AppRoutes = {
  SignIn: "/",
  SignUp: "/sign-up",
  Home: "/home",
} as const;

export const AppSessionId = "app-session-id";
