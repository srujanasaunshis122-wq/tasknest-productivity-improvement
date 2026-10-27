import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3(db);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  adapter,
  datasource: {
    url: `file:${dbPath}`,
  },
});
