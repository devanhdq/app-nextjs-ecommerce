"use client"

import Link from "next/link";

import {ColumnDef} from "@tanstack/react-table"
import Delete from "@/components/custom_ui/Delete";

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({row}) =>
            (<Link className={"hover:text-red-1"} href={`/products/${row.original._id}`}>
                {row.original.title}
            </Link>)
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "collections",
        header: "Collections",
        cell: ({row}) => row.original.collections.map(collection => collection.title).join(", ")
    },
    {
        accessorKey: "price",
        header: "Price ($)",
    },
    {
        accessorKey: "expense",
        header: "Expense ($)",
    },
    {
        id: "actions",
        cell: ({row}) => <Delete item="product" id={row.original._id}/>
    },
]
