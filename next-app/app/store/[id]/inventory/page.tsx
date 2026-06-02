import { redirect } from "next/navigation";
import AddItem from "./components/additems";
import Item from "./components/item";
import ItemDetals from "./components/itemDetals";
import * as stores from "@/db/queries/stores";
import * as items from "@/db/queries/items";

export default async function Inventory({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const store = await stores.getStoreById(id);
    if (!store) redirect("/");
    const itemList = await items.listItemsByStore(id);

    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-semibold">Inventory</h1>
                <AddItem storeID={id} />
            </div>
            <div className="flex flex-row">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
                    {itemList.map((item) => (
                        <Item item={item} key={item.id} />
                    ))}
                </div>
                <ItemDetals storeID={id} items={itemList} />
            </div>
        </div>
    );
}
