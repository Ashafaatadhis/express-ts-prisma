import morgan from "morgan";
import fs from "fs";
import path from "path";

export const logDev = morgan("dev");

export const logProd = morgan("combined", {
  stream: fs.createWriteStream(
    path.join(path.resolve(__dirname, "../../src/log"), "file.log"),
    {
      flags: "a",
    }
  ),
});
