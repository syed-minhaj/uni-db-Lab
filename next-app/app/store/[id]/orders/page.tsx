import { redirect } from "next/navigation";
import NewOrder from "./components/newOrders";
import OrderTable from "./components/orderTable";
import OrderDetals from "./components/orderDetals";
import * as stores from "@/db/queries/stores";
import * as items from "@/db/queries/items";
import * as orders from "@/db/queries/orders";

export default async function Orders({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const store = await stores.getStoreById(id);
    if (!store) redirect("/");
    const orderList = await orders.listOrdersByStoreDesc(id);
    const itemList = await items.listItemsByStore(id);

    return (
        <div className="flex flex-col gap-4 w-full max-w-[calc(100dvw-10px)] px-4 overflow-x-hidden">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-semibold">Orders</h1>
                <NewOrder storeID={id} items={itemList} />
            </div>
            <div className="flex flex-row">
                <OrderTable orders={orderList} />
                <OrderDetals orders={orderList} />
            </div>
        </div>
    );
}
