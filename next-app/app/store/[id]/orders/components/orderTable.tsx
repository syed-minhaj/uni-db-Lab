"use client"
import { Table , TableBody, TableCell, TableHeader, TableRow } from "@/app/components/ui/table";
import type { OrderWithItem } from "@/db/types";
import { useHash } from "@/app/hooks/hash";
import { getDateShort } from "@/app/utils/date";

function OrderTable({ orders }: { orders: OrderWithItem[] }) {
    const {updateHash} = useHash("")
    return (
        <Table className="rounded-r1 bg-bg2 flex-1">
            <TableHeader>
                <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell className="font-medium">Price / unit</TableCell>
                    <TableCell className="font-medium">Cost / unit</TableCell>
                    <TableCell className="font-medium">Qty</TableCell>
                    <TableCell className="font-medium">Total</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id} onClick={() => updateHash(order.id)} className="cursor-pointer">
                        <TableCell>{order.item.name}</TableCell>
                        <TableCell>{getDateShort(new Date(order.created_at))}</TableCell>
                        <TableCell>{order.price_per_unit}</TableCell>
                        <TableCell>{order.cost_per_unit}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-medium">{Number(order.price_per_unit * order.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default OrderTable;
