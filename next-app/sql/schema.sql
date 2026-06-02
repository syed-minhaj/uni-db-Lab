

-- DROP TABLE IF EXISTS "notificationRecipient" CASCADE;
-- DROP TABLE IF EXISTS "order" CASCADE;
-- DROP TABLE IF EXISTS "item" CASCADE;
-- DROP TABLE IF EXISTS "store" CASCADE;
-- DROP TABLE IF EXISTS "session" CASCADE;
-- DROP TABLE IF EXISTS "account" CASCADE;
-- DROP TABLE IF EXISTS "verification" CASCADE;
-- DROP TABLE IF EXISTS "user" CASCADE;
-- DROP TYPE IF EXISTS "orderMethod";

CREATE TABLE "store" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "item" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "store_id" text NOT NULL,
  "quantity" integer DEFAULT 0 NOT NULL,
  "sale_price" real NOT NULL,
  "cost_price" real NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "item"
  ADD CONSTRAINT "item_store_id_store_id_fk"
  FOREIGN KEY ("store_id") REFERENCES "store" ("id") ON DELETE CASCADE;

CREATE TABLE "order" (
  "id" text PRIMARY KEY NOT NULL,
  "item_id" text NOT NULL,
  "store_id" text NOT NULL,
  "quantity" integer NOT NULL,
  "price_per_unit" real NOT NULL,
  "cost_per_unit" real NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "order"
  ADD CONSTRAINT "order_item_id_item_id_fk"
  FOREIGN KEY ("item_id") REFERENCES "item" ("id") ON DELETE CASCADE;

ALTER TABLE "order"
  ADD CONSTRAINT "order_store_id_store_id_fk"
  FOREIGN KEY ("store_id") REFERENCES "store" ("id") ON DELETE CASCADE;

CREATE INDEX "idx_item_store_id" ON "item" ("store_id");
CREATE INDEX "idx_order_store_id_created_at" ON "order" ("store_id", "created_at");
