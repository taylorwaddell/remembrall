// import your .env file
import "dotenv/config";

import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
});
