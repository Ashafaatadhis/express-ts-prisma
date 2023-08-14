"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const login_1 = __importDefault(require("./login"));
const refreshToken_1 = __importDefault(require("./refreshToken"));
const router = (0, express_1.Router)();
router.use("/", users_1.default);
router.use("/login", login_1.default);
router.use("/refresh-token", refreshToken_1.default);
exports.default = router;
