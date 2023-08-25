import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../lib/config";
import crypto from "crypto";

import prisma from "../lib/prisma";

export const login = async (req: Request, res: Response) => {
  //   console.log(req.body.email);
  const acc = await prisma.user.findFirst({
    where: { email: req.body.email },
    include: { refreshToken: { select: { expiredIn: true } } },
  });

  //   if user find, it means jwt is valid
  if (acc) {
    // if user already have refresh token and refresh token no expire, this will return msg you are already logged in
    // else, will create new token and store it to database
    // if (
    //   acc.refreshToken &&
    //   new Date(acc.refreshToken.expiredIn).getTime() - new Date().getTime() > 0
    // ) {
    //   res.json({ msg: "You are already logged in" });
    // } else {

    // catatan, jika user ketemu, dan jika ada refreshtoken
    const user = { id: acc.id, name: acc.name, email: acc.email };
    const accessToken = jwt.sign(user, config.JWT_SECRET, { expiresIn: "30s" });
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const data = await prisma.refresh_token.upsert({
      where: {
        userId: acc.id,
      },
      update: {
        refreshToken: refreshToken,
        expiredIn: tomorrow.toISOString(),
        userId: acc.id,
      },
      create: {
        refreshToken: refreshToken,
        expiredIn: tomorrow.toISOString(),
        userId: acc.id,
      },
    });

    res.status(200).json({ accessToken, refreshToken });
    // }
  } else {
    res.status(401).json({ msg: "Login Failed" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.body.token;

  const data = await prisma.refresh_token.findFirst({
    where: {
      refreshToken: token,
    },
    include: {
      user: true,
    },
  });
  if (data && new Date(data.expiredIn).getTime() - new Date().getTime() > 0) {
    const accessToken = jwt.sign(data.user, config.JWT_SECRET, {
      expiresIn: "30s",
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ msg: "Token invalid or Expired" });
  }
};
