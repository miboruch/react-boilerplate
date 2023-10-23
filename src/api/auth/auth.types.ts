export type LoginData = { username: string; password: string };

export type TokensResponse = {
  token: string;
  tokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  refreshToken: string;
};

export type LoginResponse = {
  twoFaEnabled: boolean;
  mfaEnabled: boolean;
} & TokensResponse;

export type RefreshTokenData = { refreshToken: string; userId?: number };
