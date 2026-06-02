import { randomUUID } from "crypto";
import { query } from "@/app/lib/db";
import type { Store } from "@/db/types";

export async function listStores() {
  const { rows } = await query<Store>(
    `SELECT * FROM store ORDER BY created_at DESC`
  );
  return rows;
}

export async function getStoreById(storeId: string) {
  const { rows } = await query<Store>(
    `SELECT * FROM store WHERE id = $1 LIMIT 1`,
    [storeId]
  );
  return rows[0] ?? null;
}

export async function insertStore(name: string, description: string | null) {
  const id = randomUUID();
  await query(
    `INSERT INTO store (id, name, description) VALUES ($1, $2, $3)`,
    [id, name, description]
  );
  return id;
}
