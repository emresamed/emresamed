export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password"
  },
  app: {
    programs: "/programs",
    exercises: "/exercises",
    profile: "/profile"
  }
} as const;
