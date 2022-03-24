export type LoginTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
};

export type AuthCreds = {
  email: string;
  password: string;
};

export type GoogleLoginDTO = {
  token: string;
};

export type RefreshTokenResponse = LoginResponse;
