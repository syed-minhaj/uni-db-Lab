import { randomUUID } from "crypto";
import { pool, query } from "@/app/lib/db";
import type { OrderWithItem } from "@/db/types";

type OrderJoinRow = {
  id: string;
  item_id: string;
  store_id: string;
  quantity: number;
  price_per_unit: number;
  cost_per_unit: number;
  created_at: Date;
  item_id_join: string;
  item_name: string;
  item_store_id: string;
  item_quantity: number;
  item_sale_price: number;
  item_cost_price: number;
  item_created_at: Date;
  item_updated_at: Date;
};

const ORDER_WITH_ITEM_SELECT = `
  SELECT
    o.id, o.item_id, o.store_id, o.quantity, o.price_per_unit, o.cost_per_unit, o.created_at,
    i.id AS item_id_join,
    i.name AS item_name,
    i.store_id AS item_store_id,
    i.quantity AS item_quantity,
    i.sale_price AS item_sale_price,
    i.cost_price AS item_cost_price,
    i.created_at AS item_created_at,
    i.updated_at AS item_updated_at
  FROM "order" o
  INNER JOIN item i ON o.item_id = i.id
`;

function mapOrderWithItem(row: OrderJoinRow): OrderWithItem {
  return {
    id: row.id,
    item_id: row.item_id,
    store_id: row.store_id,
    quantity: row.quantity,
    price_per_unit: row.price_per_unit,
    cost_per_unit: row.cost_per_unit,
    created_at: row.created_at,
    item: {
      id: row.item_id_join,
      name: row.item_name,
      store_id: row.item_store_id,
      quantity: row.item_quantity,
      sale_price: row.item_sale_price,
      cost_price: row.item_cost_price,
      created_at: row.item_created_at,
      updated_at: row.item_updated_at,
    },
  };
}

export async function listOrdersByStoreAsc(storeId: string) {
  const { rows } = await query<OrderJoinRow>(
    `${ORDER_WITH_ITEM_SELECT}
     WHERE o.store_id = $1
     ORDER BY o.created_at ASC`,
    [storeId]
  );
  return rows.map(mapOrderWithItem);
}

export async function listOrdersByStoreDesc(storeId: string) {
  const { rows } = await query<OrderJoinRow>(
    `${ORDER_WITH_ITEM_SELECT}
     WHERE o.store_id = $1
     ORDER BY o.created_at DESC`,
    [storeId]
  );
  return rows.map(mapOrderWithItem);
}

export async function createOrderWithStockDecrement(
  storeId: string,
  itemId: string,
  quantity: number,
  pricePerUnit: number,
  costPerUnit: number
) {
  const client = await pool.connect();
  const orderId = randomUUID();
  try {
    await client.query("BEGIN");
    const stock = await client.query(
      `UPDATE item SET quantity = quantity - $1, updated_at = now()
       WHERE id = $2 AND quantity >= $1
       RETURNING id`,
      [quantity, itemId]
    );
    if (stock.rowCount === 0) {
      throw new Error("Insufficient stock");
    }
    await client.query(
      `INSERT INTO "order" (id, item_id, store_id, quantity, price_per_unit, cost_per_unit)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, itemId, storeId, quantity, pricePerUnit, costPerUnit]
    );
    await client.query("COMMIT");
    return orderId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
