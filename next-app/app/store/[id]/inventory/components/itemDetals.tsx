"use client"
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useHash } from "@/app/hooks/hash"
import { X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { Item } from "@/db/types";
import { updateItem } from "@/app/actions/store";
import { toast } from "sonner";

export default function ItemDetals({ storeID, items }: { storeID: string; items: Item[] }) {
    const {hash , updateHash} = useHash("")
    const selected = items.find((i) => i.id == hash)
    const [name, setName] = useState(selected?.name)
    const [price, setPrice] = useState(selected?.sale_price)
    const [cost, setCost] = useState(selected?.cost_price)
    const [quantity, setQuantity] = useState(selected?.quantity)
    const [updating, setUpdating] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(hash != "") {
            const item = items.find((i) => i.id == hash)
            setName(item?.name);
            setPrice(item?.sale_price);
            setCost(item?.cost_price);
            setQuantity(item?.quantity);
        }
        if (hash != "") document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';

        const handleClickOutside = async (event:MouseEvent) => {
            if (hash != "" && (!componentRef.current?.contains(event.target  as Node))) {
                updateHash("")
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [hash, items])

    function save(){
        if(!name || name == "" || price == null || cost == null || quantity == null) {
            toast.error("All fields are required");
            return;
        }
        setUpdating(true);
        toast.loading("Updating item...",{ id: "updateItem" });
        updateItem(name , price , cost , quantity , storeID , hash).then((res) => {
            if(res.err) toast.error(res.err);
            else {
                toast.success("Item updated successfully");
                updateHash("");
            }
            toast.dismiss("updateItem");
            setUpdating(false);
        })
    }

    return (
        <div className={`overflow-x-hidden transform right-0 top-0 ${hash != "" ? "" : " translate-x-[120%]"} fixed
            transition-transform duration-300 ease-in-out z-200 h-screen w-screen sm:w-auto sm:p-4`}>
            <div className="flex flex-col gap-4 w-full sm:w-96 h-full rounded-r1 border border-input bg-bg2 relative p-4" ref={componentRef}>
                <X onClick={() => updateHash("")} className="absolute right-0 top-0 m-4 opacity-50 hover:opacity-100" size={16}/>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Name</span>
                    <Input type="text" value={name ?? ""} onChange={(e) => setName(e.target.value)} className="flex-1" disabled={updating}/>
                </div>
                <div className="flex flex-row items-center gap-1 flex-wrap">
                    <span className="font-medium">Price</span>
                    <Input type="number" value={price ?? ""} onChange={(e) => setPrice(Number(e.target.value))} min={0} className="w-24" disabled={updating}/>
                    <span className="font-medium">Cost</span>
                    <Input type="number" value={cost ?? ""} onChange={(e) => setCost(Number(e.target.value))} min={0} className="w-24" disabled={updating}/>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Quantity</span>
                    <Input type="number" value={quantity ?? ""} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24" disabled={updating} min={0}/>
                </div>
                <Button className="mt-auto" onClick={() => save()} disabled={updating}>Save</Button>
            </div>
        </div>
    )
}
