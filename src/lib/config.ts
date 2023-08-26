import joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const envSchema = joi.object().keys({
  DATABASE_URL: joi.string().required(),
  PORT: joi.number().required().default(8080),
  NODE_ENV: joi.string().valid("production", "development", "test").required(),
  JWT_SECRET: joi.string().min(8).required(),
  SALT_ROUND: joi.number().greater(5).required().default(8),
  ACCESS_TOKEN_EXPIRE: joi.string().required(),
  REFRESH_TOKEN_EXPIRE: joi.number().greater(0).required(),
  REFRESH_TOKEN_COOKIE_NAME: joi.string().default("jid"),
});

const { value, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join("\n")}`
  );
}

const config = {
  DATABASE_URL: value.DATABASE_URL,
  PORT: value.PORT,
  NODE_ENV: value.NODE_ENV,
  JWT_SECRET: value.JWT_SECRET,
  SALT_ROUND: value.SALTROUND,
  ACCESS_TOKEN_EXPIRE: value.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE: value.REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_COOKIE_NAME: value.REFRESH_TOKEN_COOKIE_NAME,
};

export default config;
// console.log(error);
