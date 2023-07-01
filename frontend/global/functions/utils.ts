import { redirect } from "next/navigation";
import PocketBase from 'pocketbase';
import { ExpandedGameData, ExpandedLobbyData } from "../types/Unions";
import { PackData, Packs } from "../types/Packs";

export async function fetchPackData(packId: string): Promise<PackData | null>{
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    const pack: Packs = await pb.collection('packs').getOne(packId);
    if(!pack.id) return null;
    return pack.packData;
}
