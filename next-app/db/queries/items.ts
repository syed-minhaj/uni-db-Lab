import { randomUUID } from "crypto";
import { query } from "@/app/lib/db";
import type { Item } from "@/db/types";

export async function listItemsByStore(storeId: string) {
  const { rows } = await query<Item>(
    `SELECT * FROM item WHERE store_id = $1 ORDER BY created_at DESC`,
    [storeId]
  );
  return rows;
}

export async function getItemById(itemId: string) {
  const { rows } = await query<Item>(
    `SELECT * FROM item WHERE id = $1 LIMIT 1`,
    [itemId]
  );
  return rows[0] ?? null;
}

export async function insertItem(
  name: string,
  salePrice: number,
  costPrice: number,
  quantity: number,
  storeId: string
) {
  const id = randomUUID();
  await query(
    `INSERT INTO item (id, name, store_id, quantity, sale_price, cost_price)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, storeId, quantity, salePrice, costPrice]
  );
  return id;
}

export async function updateItem(
  itemId: string,
  name: string,
  salePrice: number,
  costPrice: number,
  quantity: number
) {
  await query(
    `UPDATE item
     SET name = $1, sale_price = $2, cost_price = $3, quantity = $4, updated_at = now()
     WHERE id = $5`,
    [name, salePrice, costPrice, quantity, itemId]
  );
}
