"use client"
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select ,SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/app/components/ui/select";
import type { Item } from "@/db/types";
import { X } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import { toast } from "sonner";
import { createOrder as createOrderApi } from "@/app/actions/store";

function ItemOption({ item }: { item: Item }) {
    return (
        <div className="flex flex-col gap-0.5 py-1">
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">Stock: {item.quantity}</span>
        </div>
    )
}

export default function NewOrder({ items, storeID }: { items: Item[]; storeID: string }) {
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item>();
    const [quantity, setQuantity] = useState(1);
    const [pricePerUnit, setPricePerUnit] = useState<number>();
    const [costPerUnit, setCostPerUnit] = useState<number>();
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = async (event:MouseEvent) => {
            if (event.target == document.getElementById("background")) setOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [])

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    useEffect(() => {
        if(!selectedItem) return;
        setPricePerUnit(selectedItem.sale_price)
        setCostPerUnit(selectedItem.cost_price)
    }, [selectedItem])

    function createOrder() {
        if(!selectedItem) {toast.error("Select Item"); return;}
        if(!quantity || quantity < 0) {toast.error("Invalid quantity"); return}
        if(quantity > selectedItem.quantity) {toast.error("Not enough item in stock");return}
        if(pricePerUnit == null || pricePerUnit < 0) {toast.error("Invalid price");return}
        if(costPerUnit == null || costPerUnit < 0) {toast.error("Invalid cost");return}
        setAdding(true);
        toast.loading("Creating Order" , { id : "creatingOrder" });
        createOrderApi(storeID , selectedItem.id , quantity , pricePerUnit , costPerUnit).then((res) => {
            toast.dismiss("creatingOrder");
            if(res.err) toast.error(res.err);
            else {
                toast.success("Order Created");
                setOpen(false);
                setSelectedItem(undefined);
                setQuantity(1);
                setPricePerUnit(undefined);
                setCostPerUnit(undefined);
            }
            setAdding(false);
        })
    }

    return (
        <>
            <Button className="rounded-r1 ml-auto" variant={"default"} onClick={() => setOpen(!open)} id="newOrder">
                New order
            </Button>
            <div className={`${open ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen bg-black/50 dark:bg-gray-800/50 flex items-center justify-center z-100`} id="background">
                <div className={`w-full h-full sm:w-120 sm:h-5/6 rounded-r1 bg-bg1 relative p-4 flex flex-col gap-4 z-110`} ref={formRef}>
                    <X className="m-4 absolute top-0 right-0 opacity-50 hover:opacity-100" size={16} onClick={() => setOpen(!open)}/>
                    <h2 className="font-medium ml-1">New Order</h2>
                    <Select onValueChange={(v) => setSelectedItem(items.find(i => i.id == v))}>
                        <SelectTrigger className="w-full min-h-14 p-3" disabled={adding}>
                            {selectedItem ? <ItemOption item={selectedItem}/> : <SelectValue placeholder="Select item" />}
                        </SelectTrigger>
                        <SelectContent className="z-200">
                            <SelectGroup>
                                <SelectLabel>Items</SelectLabel>
                                {items.map((i) => (
                                    <SelectItem value={i.id} key={i.id}>
                                        <ItemOption item={i}/>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="font-medium text-sm">Quantity</span>
                        <Input className="flex-1" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} disabled={adding} />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="font-medium text-sm">Price / unit</span>
                        <Input className="flex-1" type="number" min={0} value={pricePerUnit ?? ""} onChange={(e) => setPricePerUnit(Number(e.target.value))} disabled={adding} />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="font-medium text-sm">Cost / unit</span>
                        <Input className="flex-1" type="number" min={0} value={costPerUnit ?? ""} onChange={(e) => setCostPerUnit(Number(e.target.value))} disabled={adding} />
                    </div>
                    <Button className="rounded-r1 mt-auto ml-auto" disabled={adding} onClick={() => createOrder()}>Create</Button>
                </div>
            </div>
        </>
    )
}
