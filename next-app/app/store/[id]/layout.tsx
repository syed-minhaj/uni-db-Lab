
import SideBar from "../../components/sideBar";
import BottomBar from "../../components/bottomBar";

export default async function StoreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <main lang="en" className="flex flex-row min-h-screen">
      <SideBar store={id} />
      <div className="flex flex-col flex-1">
        <div className="min-h-screen py-4">
          {children}
        </div>
        <BottomBar store={id} />
      </div>
    </main>
  );
}
