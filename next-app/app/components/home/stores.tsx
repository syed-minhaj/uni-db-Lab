"use client"

import type { Store } from "@/db/types";
import Link from "next/link";

export default function Stores({ stores }: { stores: Store[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stores.map((s) => (
        <Link
          href={`/store/${s.id}/dashboard`}
          className="bg-bg2 border hover:border-black/20 dark:hover:border-white/40 rounded-r1 p-4 flex flex-col gap-2 min-h-28"
          key={s.id}
        >
          <h2 className="font-medium">{s.name}</h2>
          <p className="text-sm text-muted-foreground">{s.description}</p>
        </Link>
      ))}
    </div>
  );
}
