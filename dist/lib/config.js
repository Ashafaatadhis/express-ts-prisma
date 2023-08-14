"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const envSchema = joi_1.default.object().keys({
    DATABASE_URL: joi_1.default.string().required(),
    PORT: joi_1.default.number().required().default(8080),
    NODE_ENV: joi_1.default.string().valid("production", "development", "test").required(),
    JWT_SECRET: joi_1.default.string().min(8).required(),
});
const { value, error } = envSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env, { abortEarly: false, stripUnknown: true });
if (error) {
    throw new Error(`Environment variable validation error: \n${error.details
        .map((detail) => detail.message)
        .join("\n")}`);
}
const config = {
    DATABASE_URL: value.DATABASE_URL,
    PORT: value.PORT,
    NODE_ENV: value.NODE_ENV,
    JWT_SECRET: value.JWT_SECRET,
};
exports.default = config;
// console.log(error);
