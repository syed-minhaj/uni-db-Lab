"use server"
import { revalidatePath } from "next/cache";
import * as stores from "@/db/queries/stores";
import * as items from "@/db/queries/items";
import * as orders from "@/db/queries/orders";

export const createStore = async (name:string , description:string) => {
    if(name == "") return {err : "Name is required"};
    
    try{
        await stores.insertStore(name, description || null);
        revalidatePath("/");
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}
}

export const addItem = async (name:string , price:number , cost:number , quantity:number , storeID:string) => {
    if(name == "") return {err : "Name is required"};
    
    try{
        await items.insertItem(name, price, cost, quantity, storeID);
        revalidatePath(`/store/${storeID}/inventory`);
    }catch(e){
        console.log(e)
        return {err : "Failed to create item"}
    }
    return {err : null}
}

export async function updateItem(name:string , price:number , cost:number , quantity:number , storeID:string , itemID:string) {
    if(name == "") return {err : "Name is required"};
    if(price < 0) return {err : "Price cannot be negative"};
    if(cost < 0) return {err : "Cost cannot be negative"};
    if(quantity < 0) return {err : "Quantity cannot be negative"};
    
    const i = await items.getItemById(itemID);
    if(!i || i.store_id != storeID) return {err : "item is not in this store"};

    try{
        await items.updateItem(itemID, name, price, cost, quantity);
        revalidatePath(`/store/${storeID}/inventory`);
    }catch(e){
        console.log(e)
        return {err : "Failed to update item"}
    }
    return {err : null}
}

export async function createOrder(storeID:string , itemID:string , quantity:number ,
        pricePerUnit:number , costPerUnit:number
) {
    if(quantity < 0) return {err : "Quantity cannot be negative"};
    if(pricePerUnit < 0) return {err : "Price cannot be negative"};
    if(costPerUnit < 0) return {err : "Cost cannot be negative"};
    
    const i = await items.getItemById(itemID);
    if(!i || i.store_id != storeID) return {err : "item is not in this store"};

    try{
        await orders.createOrderWithStockDecrement(
            storeID, itemID, quantity, pricePerUnit, costPerUnit
        );
        revalidatePath(`/store/${storeID}/orders`);
    }catch(e){
        console.log(e)
        return {err : "Failed to create order"}
    }
    return {err : null}
}
