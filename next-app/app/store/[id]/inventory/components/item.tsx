"use client"
import { useHash } from "@/app/hooks/hash"
import type { Item } from "@/db/types";

export default function Item({ item }: { item: Item }) {
    const {updateHash} = useHash("")
    return (
        <div className="flex flex-col gap-2 bg-bg2 rounded-r1 border border-input w-full sm:w-64 p-4 hover:border-black/20 dark:hover:border-white/40 cursor-pointer" 
        onClick={() => updateHash(item.id)} >
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm">Price: <span className="font-medium">{item.sale_price}</span></p>
            <p className="text-sm">Quantity: <span className="font-medium">{item.quantity}</span></p>
        </div>
    )
}
