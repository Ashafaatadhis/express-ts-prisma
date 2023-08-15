import { CookieOptions } from "express";
export const refreshTokenConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

export const clearRefreshTokenConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};
