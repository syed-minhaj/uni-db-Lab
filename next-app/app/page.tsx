
import InputArea from "./components/home/inputArea";
import Stores from "./components/home/stores";
import * as stores from "@/db/queries/stores";

export default async function Home() {
  const storeList = await stores.listStores();

  return (
    <>
      <div className="flex flex-col w-11/12 mx-auto gap-6">
        <div className="flex items-center mt-8">
            <div className="flex items-center font-semibold text-nowrap">
            Inventory Management System
            </div>
            <InputArea />
        </div>
        <h2 className="ml-1 font-semibold text-xl">Stores</h2>
        <Stores stores={storeList} />
      </div>
    </>
  );
}
