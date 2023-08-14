import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();

app.use(morgan("dev"));
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(
      path.join(__dirname + "/../src/log", "file.log"),
      {
        flags: "a",
      }
    ),
  })
);

app.use(express.json());
app.use(routes);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
