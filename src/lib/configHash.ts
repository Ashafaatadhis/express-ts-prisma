import bcrypt from "bcrypt";
import config from "./config";

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.SALT_ROUND);
  return bcrypt.hash(password, salt);
};

export const verify = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const compare = await bcrypt.compare(password, hash);
  return compare;
};
