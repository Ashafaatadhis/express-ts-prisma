"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Auth_1 = require("../../middleware/Auth");
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(req.body.email);
    const acc = yield prisma_1.default.user.findFirst({
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
        const user = { id: acc.id, name: acc.name, email: acc.email };
        const accessToken = jsonwebtoken_1.default.sign(user, Auth_1.keyJWT, { expiresIn: "30s" });
        const refreshToken = crypto_1.default.randomBytes(32).toString("hex");
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const data = yield prisma_1.default.refresh_token.upsert({
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
    }
    else {
        res.status(401).json({ msg: "Login Failed" });
    }
}));
exports.default = router;
