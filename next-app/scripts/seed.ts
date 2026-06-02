import { randomUUID } from "crypto";
import { Pool } from "pg";
import { loadEnv } from "./load-env";

loadEnv();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    const existing = await pool.query(
      `SELECT id FROM store WHERE name = $1 LIMIT 1`,
      ["Demo Campus Shop"]
    );
    if (existing.rows.length > 0) {
      console.log("Demo data already exists. Skipping seed.");
      return;
    }

    const storeId = randomUUID();
    const item1 = randomUUID();
    const item2 = randomUUID();
    const item3 = randomUUID();

    await pool.query("BEGIN");

    await pool.query(
      `INSERT INTO store (id, name, description) VALUES ($1, $2, $3)`,
      [storeId, "Demo Campus Shop", "Sample data for coursework"]
    );

    await pool.query(
      `INSERT INTO item (id, name, store_id, quantity, sale_price, cost_price)
       VALUES
         ($1, 'Notebook', $4, 50, 4.99, 2.50),
         ($2, 'Pen Pack', $4, 120, 3.49, 1.20),
         ($3, 'USB Drive 32GB', $4, 25, 12.99, 7.00)`,
      [item1, item2, item3, storeId]
    );

    await pool.query(
      `INSERT INTO "order" (id, item_id, store_id, quantity, price_per_unit, cost_per_unit, created_at)
       VALUES
         ($1, $2, $6, 5, 4.99, 2.50, date_trunc('year', now()) + interval '1 month'),
         ($3, $4, $6, 10, 3.49, 1.20, date_trunc('year', now()) + interval '2 months'),
         ($5, $7, $6, 2, 12.99, 7.00, date_trunc('year', now()) + interval '3 months')`,
      [randomUUID(), item1, randomUUID(), item2, randomUUID(), storeId, item3]
    );

    await pool.query("COMMIT");
    console.log(`Seeded demo store ${storeId}.`);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
