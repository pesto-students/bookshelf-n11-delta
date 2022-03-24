import type {LoginResponse, LoginTokens} from '../types';

type TokenPayload = LoginTokens;

enum AuthKeys {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

function getAccessToken() {
  return localStorage.getItem(AuthKeys.ACCESS_TOKEN);
}

function setAccessToken(accessToken: string) {
  localStorage.setItem(AuthKeys.ACCESS_TOKEN, accessToken);
}

function getRefreshToken() {
  return localStorage.getItem(AuthKeys.REFRESH_TOKEN);
}

function setRefreshToken(refreshToken: string) {
  localStorage.setItem(AuthKeys.REFRESH_TOKEN, refreshToken);
}

function setTokenPayload(payload: LoginResponse): void {
  setAccessToken(payload.token);
  setRefreshToken(payload.refreshToken);
}

function getTokenPayload(): TokenPayload {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
}

function clearTokenPayload(): void {
  localStorage.removeItem(AuthKeys.ACCESS_TOKEN);
  localStorage.removeItem(AuthKeys.REFRESH_TOKEN);
}

export {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setTokenPayload,
  getTokenPayload,
  clearTokenPayload,
};

export const TokenService = {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setTokenPayload,
  getTokenPayload,
  clearTokenPayload,
};
