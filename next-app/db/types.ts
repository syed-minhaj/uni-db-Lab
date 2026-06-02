export type Store = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Item = {
  id: string;
  name: string;
  store_id: string;
  quantity: number;
  sale_price: number;
  cost_price: number;
  created_at: Date;
  updated_at: Date;
};

export type OrderWithItem = {
  id: string;
  item_id: string;
  store_id: string;
  quantity: number;
  price_per_unit: number;
  cost_per_unit: number;
  created_at: Date;
  item: Item;
};
