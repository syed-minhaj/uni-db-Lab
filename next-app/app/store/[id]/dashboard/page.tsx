import { redirect } from "next/navigation";
import { Info } from "./components/info";
import * as stores from "@/db/queries/stores";
import * as items from "@/db/queries/items";
import * as orders from "@/db/queries/orders";

export default async function Dashboard({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const store = await stores.getStoreById(id);
    if (!store) redirect("/");
    const itemList = await items.listItemsByStore(id);
    const orderList = await orders.listOrdersByStoreAsc(id);

    const totalRevenue = orderList.reduce(
        (sum, order) => sum + order.price_per_unit * order.quantity,
        0
    );
    const totalCost = orderList.reduce(
        (sum, order) => sum + order.cost_per_unit * order.quantity,
        0
    );
    const totalProfit = totalRevenue - totalCost;
    const totalOrders = orderList.length;
    const totalUnitsSold = orderList.reduce((sum, order) => sum + order.quantity, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStockCount = itemList.filter((entry) => entry.quantity < 10).length;
    const outOfStockCount = itemList.filter((entry) => entry.quantity === 0).length;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden mb-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info heading="Number of Items" value={itemList.length.toString()} />
                <Info heading="Total Orders" value={totalOrders.toString()} />
                <Info heading="Units Sold" value={totalUnitsSold.toString()} />
                <Info heading="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
                <Info heading="Cost" value={`$${totalCost.toFixed(2)}`} />
                <Info heading="Profit" value={`$${totalProfit.toFixed(2)}`} />
                <Info heading="Avg Order Value" value={`$${averageOrderValue.toFixed(2)}`} />
                <Info heading="Low Stock" value={lowStockCount.toString()} />
                <Info heading="Out of Stock" value={outOfStockCount.toString()} />
                <Info heading="Profit Margin" value={`${profitMargin.toFixed(1)}%`} />
            </div>
        </div>
    );
}
