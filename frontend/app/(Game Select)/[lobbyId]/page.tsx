import { pb } from "@/app/api/pocketbase";
import LobbyActionWrapper from "@/components/LobbyActionWrapper";
import { LobbyData, LobbyPayloadData } from "@/global/types/LobbyData";
import { Packs } from "@/global/types/Packs";
import Link from 'next/link';
import { cookies } from "next/headers";


async function getLobbyData (lobbyId: string): Promise<LobbyData> {
   
    const record = await fetch(`http://127.0.0.1:8091/api/collections/lobbys/records/${lobbyId}?expand=guests,players,packs`, {
        cache: 'no-store',
        next: {
            revalidate: 10
        }
    });
    if(!record.ok) { throw new Error("Could not find record!")}
    
    const data: LobbyData = await record.json();
    if(!data){
        throw new Error(`Error loading lobby ${lobbyId}`);
    }
    return data;
}


export default async function Lobby({
    params
}: {
    params: {
        lobbyId: string
    }
}){

    const cookieStore = cookies();
    const token = cookieStore.get('token');
    console.log(token);

    let data = await getLobbyData(params.lobbyId);
    

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-center py-2">
                <button className="text-4xl font-bold btn btn-ghost z-10">
                {/* Add checks to see if user is host or guest. If Host, popup modal asking if they want to close the lobby. If Guest, ask if they want to leave lobby. If signed, ask if they want to leave or check something else?*/}
                    <Link href="/Play">Aux-Battles</Link>  
                </button>
            </div>      
            <div className="flex flex-col justify-center grow min-w-full z-0 lg:p-4">
                <LobbyActionWrapper lobbyId={params.lobbyId} data={data} className=""/>
            </div>
        </div>
    );
}