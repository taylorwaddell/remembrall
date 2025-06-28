import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: `${process.env.AUTH_TURSO_DATABASE_URL}`,
  authToken: `${process.env.AUTH_TURSO_AUTH_TOKEN}`,
});

const createPrismaClient = () => {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({ adapter });
  } else {
    return new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
};

export const db = createPrismaClient();
