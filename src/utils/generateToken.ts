import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../lib/config";

export const createAccessToken = (userId: number | string) => {
  return jwt.sign({ userID: userId }, config.JWT_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRE,
  });
};

export const createRefreshToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
