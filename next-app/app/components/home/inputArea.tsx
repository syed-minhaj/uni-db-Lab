'use client'
import { Button } from "@/app/components/ui/button"
import { useEffect, useState } from "react"
import CreateStore from "./createStore";

export default function InputArea() {
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    return (
        <div className="flex flex-row gap-2 w-full  justify-end">
            <Button className="rounded-r1" variant={"default"} onClick={() => setOpen(!open)} id="addStore">
                Add Store
            </Button>
            <CreateStore open={open} setOpen={setOpen}/>
        </div>
    )
}
