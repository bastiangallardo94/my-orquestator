export interface AuthConfig {
  clientId?: string;
  scopes: string[];
  requiresAuth: boolean;
}

export const AuthConfigDefault: AuthConfig = {
  scopes: ["openid", "profile", "email"],
  requiresAuth: true,
};
