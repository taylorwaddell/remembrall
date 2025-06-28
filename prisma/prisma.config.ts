// import your .env file
import "dotenv/config";

import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { defineConfig } from "prisma/config";
import path from "node:path";

type Env = {
  AUTH_LIBSQL_DATABASE_URL: string;
  AUTH_LIBSQL_DATABASE_TOKEN: string;
};

export default defineConfig<Env>({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),

  migrate: {
    async adapter(env) {
      if (process.env.NODE_ENV === "production") {
        return new PrismaLibSQL({
          url: env.AUTH_LIBSQL_DATABASE_URL,
          authToken: env.AUTH_LIBSQL_DATABASE_TOKEN,
        });
      }

      return new PrismaLibSQL({ url: "file:./dev.db" });
    },
  },
});
