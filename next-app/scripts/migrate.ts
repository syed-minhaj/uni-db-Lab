import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";
import { loadEnv } from "./load-env";

loadEnv();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const schemaPath = join(process.cwd(), "sql", "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  try {
    await pool.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
