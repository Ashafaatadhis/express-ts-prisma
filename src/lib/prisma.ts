import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const conn = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    return;
  } catch (e) {
    console.log(e);
  }
};
conn();
export default prisma;
