import DashboardHeader from "@/components/DashboardHeader";
import DashBoardSwitch from "@/components/DashboardSwitch";
import PocketBase, { Record, Admin } from "pocketbase";

async function getUserData():Promise<Record | Admin | null> {
    const pb = new PocketBase('http://127.0.0.1:8091');
    return pb.authStore.model;
}

export default async function Dashboard(){

    // const data = await getUserData();

    return (
        <div className="flex flex-col bg-base-100 h-full ">
            <div className=" hero-overlay bg-opacity-0">
                <div className="min-w-full flex justify-center">
                    {/* <DashBoardSwitch className="w-full sm:w-10/12 md:w-8/12 mb-1 font-bold tracking-wide"/> */}
                </div>
                <div className="flex flex-col items-center h-full">
                    {/* <DashboardHeader userModel={data}/> */}
                    <div>Dash content</div>
                </div>
                
            </div>
        </div>
    );
}