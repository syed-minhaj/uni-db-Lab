"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ClipboardList, Package, MoveLeft } from "lucide-react";

const Pages = ["dashboard", "orders", "inventory"];

const IconComponent = ({ page }: { page: string }) => {
  if (page == "dashboard") return <LayoutDashboard size={20} className="font-medium" />;
  if (page == "orders") return <ClipboardList size={20} />;
  if (page == "inventory") return <Package size={20} />;
  return <div className="h-5 w-5" />;
};

export default function SideBar({ store }: { store: string }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`${open ? "w-60" : "w-17.5"} hidden sticky top-0 h-screen bg-bg2 sm:flex flex-col transition-[width] duration-300 ease-in-out sideBar-parent`}
    >
      <div className="h-16 flex flex-row pt-4 pl-6">
        
        <MoveLeft
          className={`absolute right-5.75 p-1 text-black/85 dark:text-white/85 border border-black/20 dark:border-white/20 rounded ${open ? "" : "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className="px-4 flex flex-col gap-1 flex-1 group sideBar-child">
        {Pages.map((page, index) => (
          <Link
            href={`/store/${store}/${page}`}
            key={index}
            className={`${open ? "w-52" : "w-9.5"} rounded-r1 border flex flex-row items-center transition-[width] duration-300 ease-in-out group-hover:w-52 hover:bg-bg1 hover:border-black/10
              ${pathname.split(`/store/${store}/`).at(-1) == page ? "bg-bg1 border-black/20 dark:border-white/20" : "border-transparent"}
              p-2 px-2 leading-none font-medium text-black/85 dark:text-white/85`}
          >
            <IconComponent page={page} />
            <span
              className={`${open ? "w-24" : "w-0"} overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-in-out group-hover:w-24`}
            >
              &nbsp;{page.charAt(0).toUpperCase() + page.slice(1)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
