import express, { Express, Request, Response } from "express";
import config from "./lib/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { logDev, logProd } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

if (config.NODE_ENV == "production") {
  app.use(logProd);
} else {
  app.use(logDev);
}

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
