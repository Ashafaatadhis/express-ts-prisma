import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../lib/config";
import { verify } from "../lib/configHash";
import { createAccessToken, createRefreshToken } from "../utils/generateToken";

import prisma from "../lib/prisma";
import {
  refreshTokenConfig,
  clearRefreshTokenConfig,
} from "../lib/cookieConfig";

export const login = async (req: Request, res: Response) => {
  //   console.log(req.body.email);
  const cookies = req.cookies;
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ msg: "Login Failed" });
  }

  try {
    if (await verify(password, user.password)) {
      if (cookies?.[config.REFRESH_TOKEN_COOKIE_NAME]) {
        const checkRefreshToken = await prisma.refresh_token.findUnique({
          where: {
            refreshToken: cookies[config.REFRESH_TOKEN_COOKIE_NAME],
          },
        });

        if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
          await prisma.refresh_token.deleteMany({
            where: {
              userId: user.id,
            },
          });
        } else {
          await prisma.refresh_token.delete({
            where: {
              refreshToken: cookies[config.REFRESH_TOKEN_COOKIE_NAME],
            },
          });
        }

        res.clearCookie(
          config.REFRESH_TOKEN_COOKIE_NAME,
          clearRefreshTokenConfig
        );
      }
      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken();

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + config.REFRESH_TOKEN_EXPIRE);

      const data = await prisma.refresh_token.create({
        data: {
          refreshToken: refreshToken,
          expiredIn: tomorrow.toISOString(),
          userId: user.id,
        },
      });

      res.cookie(
        config.REFRESH_TOKEN_COOKIE_NAME,
        refreshToken,
        refreshTokenConfig
      );

      return res.status(200).json({ accessToken });
    } else {
      return res.status(401).json({ msg: "Login Failed" });
    }
  } catch (e) {
    return res.status(401).json({ msg: "Login Failed" });
  }

  // }
};

export const handleLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies[config.REFRESH_TOKEN_COOKIE_NAME]) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies[config.REFRESH_TOKEN_COOKIE_NAME];
  const foundRft = await prisma.refresh_token.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!foundRft) {
    res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, clearRefreshTokenConfig);
    return res.sendStatus(204);
  }

  await prisma.refresh_token.delete({
    where: {
      refreshToken: refreshToken,
    },
  });

  res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, clearRefreshTokenConfig);
  return res.sendStatus(204);
};

export const refreshToken = async (req: Request, res: Response) => {
  const token: string | undefined =
    req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];

  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, clearRefreshTokenConfig);

  const foundRefreshToken = await prisma.refresh_token.findUnique({
    where: {
      refreshToken: token,
    },
    include: {
      user: true,
    },
  });

  // if refresh token not found and expired, it will return 401
  if (
    !foundRefreshToken ||
    new Date(foundRefreshToken.expiredIn).getTime() - new Date().getTime() < 0
  ) {
    return res.status(401).json({ msg: "Token invalid or Expired" });
  }

  await prisma.refresh_token.delete({
    where: {
      refreshToken: token,
    },
  });

  const accessToken = createAccessToken(foundRefreshToken.userId);
  const newRefreshToken = createRefreshToken();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + config.REFRESH_TOKEN_EXPIRE);

  await prisma.refresh_token.create({
    data: {
      refreshToken: newRefreshToken,
      expiredIn: tomorrow.toISOString(),
      userId: foundRefreshToken.userId,
    },
  });

  res.cookie(
    config.REFRESH_TOKEN_COOKIE_NAME,
    newRefreshToken,
    refreshTokenConfig
  );

  res.status(200).json({ accessToken });
};
