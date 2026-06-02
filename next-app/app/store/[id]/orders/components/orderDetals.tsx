"use client"
import { useHash } from "@/app/hooks/hash"
import { X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { OrderWithItem } from "@/db/types";

export default function OrderDetals({ orders }: { orders: OrderWithItem[] }) {
    const {hash , updateHash} = useHash("")
    const selected = orders.find((o) => o.id == hash)
    const [name, setName] = useState(selected?.item.name)
    const [price, setPrice] = useState(selected?.price_per_unit)
    const [cost, setCost] = useState(selected?.cost_per_unit)
    const [quantity, setQuantity] = useState(selected?.quantity)
    const [orderDate, setOrderDate] = useState(selected?.created_at)
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(hash != "") {
            const order = orders.find((o) => o.id == hash)
            setName(order?.item.name);
            setPrice(order?.price_per_unit);
            setCost(order?.cost_per_unit);
            setQuantity(order?.quantity);
            setOrderDate(order?.created_at);
        }
        const handleClickOutside = async (event:MouseEvent) => {
            if (hash != "" && !componentRef.current?.contains(event.target  as Node)) {
                updateHash("")
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [hash, orders])

    return (
        <div className={`overflow-x-hidden transform right-0 top-0 ${hash != "" ? "" : " translate-x-[120%]"} fixed
            transition-transform duration-300 ease-in-out z-200 h-screen w-screen sm:w-auto p-4`}>
            <div className="flex flex-col gap-4 w-full sm:w-96 h-full rounded-r1 border border-input bg-bg2 relative p-4" ref={componentRef}>
                <X onClick={() => updateHash("")} className="absolute right-0 top-0 m-4 opacity-50 hover:opacity-100" size={16}/>
                <p><span className="font-medium">Name:</span> {name}</p>
                <p><span className="font-medium">Price:</span> {price}</p>
                <p><span className="font-medium">Cost:</span> {cost}</p>
                <p><span className="font-medium">Quantity:</span> {quantity}</p>
                <p><span className="font-medium">Total:</span> {(price && quantity) ? price * quantity : ""}</p>
                <p><span className="font-medium">Date:</span> {orderDate ? new Date(orderDate).toLocaleString() : ""}</p>
            </div>
        </div>
    )
}
