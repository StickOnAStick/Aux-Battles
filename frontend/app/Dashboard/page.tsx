import DashboardHeader from "./DashboardHeader";
import DashBoardSwitch from "@/components/DashboardSwitch";
import DashboardContianer from "./DashboardContainer";
import DashboardMarket from "./DashboardMarket";
import Pocketbase from 'pocketbase';
import { Packs } from "@/global/types/Packs";

export default async function Dashboard(){

    
    return (
        <div className="flex flex-col min-h-screen items-center gap-5">
            <DashBoardSwitch/>
            <DashboardContianer>
                <DashboardHeader/>
                <hr className="solid opacity-40 my-3"/>
                <DashboardMarket />
            </DashboardContianer>
            
        </div>
    )
}