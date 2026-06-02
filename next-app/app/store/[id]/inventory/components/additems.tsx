"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { X } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import { addItem } from "@/app/actions/store";

export default function AddItem({storeID}:{storeID:string}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>();
    const [cost , setCost] = useState<number>();
    const [quantity, setQuantity] = useState(0);
    const [adding, setAdding] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    function add(){
        if(name == "" || price == null || cost == null || quantity == null) {
            toast.error("All fields are required");
            return;
        }
        setAdding(true);
        toast.loading("Adding item...",{ id: "addItem" });
        addItem(name , price , cost , quantity , storeID).then((res) => {
            if(res.err) toast.error(res.err);
            else {
                toast.success("Item added successfully");
                setOpen(false);
                setName("");
                setPrice(undefined);
                setCost(undefined);
                setQuantity(0);
            }
            toast.dismiss("addItem");
            setAdding(false);
        })
    }

    useEffect(() => {
        const handleClickOutside = async (event:MouseEvent) => {
            if (!formRef.current?.contains(event.target  as Node) && event.target != document.getElementById("addItem")) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [])

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    return (
        <>
            <Button className="rounded-r1 ml-auto" variant={"default"} onClick={() => setOpen(!open)} id="addItem">
                Add Item
            </Button>
            <div className={`${open ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen bg-black/50 dark:bg-gray-800/50 flex items-center justify-center z-100`}>
                <div className={`w-full h-full sm:w-120 sm:h-5/6 rounded-r1 bg-bg1 relative p-4 flex flex-col gap-4 z-110`} ref={formRef}>
                    <X className="m-4 absolute top-0 right-0 opacity-50 hover:opacity-100" size={16} onClick={() => setOpen(!open)}/>
                    <h2 className="font-medium ml-1">Add Item</h2>
                    <div className="flex flex-col gap-1 text-normal">
                        <Input placeholder="Name" type="text" value={name} className="bg-bg2 rounded-r1" disabled={adding} required
                            onChange={(e) => setName(e.target.value)}/>
                        <div className="flex flex-row gap-2">
                            <Input placeholder="Price" type="number" value={price ?? ""} className="bg-bg2 rounded-r1" disabled={adding} required
                                onChange={(e) => setPrice(Number(e.target.value))}/>
                            <Input placeholder="Cost" type="number" value={cost ?? ""} className="bg-bg2 rounded-r1" disabled={adding} required
                                onChange={(e) => setCost(Number(e.target.value))}/>
                        </div>
                        <Input placeholder="Quantity" type="number" className="bg-bg2 rounded-r1" disabled={adding} required
                            onChange={(e) => setQuantity(Number(e.target.value))} value={quantity}/>
                    </div>
                    <Button className="rounded-r1 mt-auto ml-auto" variant={"default"} disabled={adding}
                        onClick={() => add()}>Add Item</Button>
                </div>
            </div>
        </>
    )
}
