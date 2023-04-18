import DashboardHeader from "@/components/DashboardHeader";
import DashBoardSwitch from "@/components/DashboardSwitch";
import { Record, Admin } from "pocketbase";
import { pb } from "../api/pocketbase";

async function getUserData():Promise<Record | Admin | null> {
    return pb.authStore.model;
}

export default async function Dashboard(){

    const data = await getUserData();

    return (
        <div className="flex flex-col bg-base-100 h-full ">
            <div className=" hero-overlay bg-opacity-0">
                <div className="min-w-full flex justify-center">
                    <DashBoardSwitch className="w-full sm:w-10/12 md:w-8/12 mb-1 font-bold tracking-wide"/>
                </div>
                <div className="flex flex-col xs:flex-row justify-center sm:flex-none h-full">
                    <DashboardHeader userModel={data}/>
                </div>
                
            </div>
        </div>
    );
}