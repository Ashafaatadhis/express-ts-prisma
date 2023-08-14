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
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const data = yield prisma_1.default.refresh_token.findFirst({
        where: {
            refreshToken: token,
        },
        include: {
            user: true,
        },
    });
    if (data && new Date(data.expiredIn).getTime() - new Date().getTime() > 0) {
        const accessToken = jsonwebtoken_1.default.sign(data.user, Auth_1.keyJWT, { expiresIn: "30s" });
        res.status(200).json({ accessToken });
    }
    else {
        res.status(401).json({ msg: "Token invalid or Expired" });
    }
}));
exports.default = router;
