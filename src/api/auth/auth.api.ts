import { client } from "../client";
import { LoginData, TokensResponse, LoginResponse, RefreshTokenData } from "./auth.types";

export const login = client.createRequest<LoginResponse, LoginData>()({
  endpoint: "/dashboard/auth/login",
  method: "POST",
  options: { timeout: 0 },
});

export const renewToken = client.createRequest<TokensResponse, RefreshTokenData>()({
  endpoint: "/auth/renew-token",
  method: "POST",
  auth: false,
  options: { timeout: 0 },
});
