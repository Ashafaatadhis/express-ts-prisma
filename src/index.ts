import app from "./app";
import prismaClient from "./lib/prisma";
import config from "./lib/config";

process.on("SIGINT", async (e) => {
  await prismaClient.$disconnect();
  console.log("Prisma disconect");
  process.exit(1);
});

app.listen(config.PORT, async () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${config.PORT}`
  );
});
