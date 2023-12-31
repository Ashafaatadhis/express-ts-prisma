import joi from "joi";

const envSchema = joi.object().keys({
  DATABASE_URL: joi.string().required(),
  PORT: joi.number().required().default(8080),
  NODE_ENV: joi.string().valid("production", "development", "test").required(),
  JWT_SECRET: joi.string().min(8).required(),
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
};

export default config;
// console.log(error);
