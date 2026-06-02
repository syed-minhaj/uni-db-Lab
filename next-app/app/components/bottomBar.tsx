"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Package } from "lucide-react";

const Pages = ["dashboard", "orders", "inventory"];

const IconComponent = ({ page }: { page: string }) => {
  if (page == "dashboard") return <LayoutDashboard size={20} className="font-medium" />;
  if (page == "orders") return <ClipboardList size={20} />;
  if (page == "inventory") return <Package size={20} />;
  return <div className="h-5 w-5" />;
};

export default function BottomBar({ store }: { store: string }) {
  const pathname = usePathname();

  return (
    <div className="sm:hidden flex flex-row w-full h-16 px-2 bg-bg2 sticky bottom-0 justify-between items-center border-t border-black/20 dark:border-white/20">
      {Pages.map((page, index) => (
        <Link
          href={`/store/${store}/${page}`}
          key={index}
          className={`rounded-r1 border flex flex-col items-center text-xs hover:bg-bg1 hover:border-black/10
            ${pathname.split(`/store/${store}/`).at(-1) == page ? "bg-bg1 border-black/20 dark:border-white/20" : "border-transparent"}
            p-2 px-1 leading-none font-medium text-black/85 dark:text-white/85`}
        >
          <IconComponent page={page} />
          <span>{page.charAt(0).toUpperCase() + page.slice(1)}</span>
        </Link>
      ))}
    </div>
  );
}
