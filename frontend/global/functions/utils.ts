import { redirect } from "next/navigation";
import PocketBase from 'pocketbase';
import { ExpandedGameData, ExpandedLobbyData } from "../types/Unions";
import { PackData, Packs } from "../types/Packs";
import { io } from 'socket.io-client';

export async function fetchPackData(packId: string): Promise<PackData | null>{
    const pb = new PocketBase('http://127.0.0.1:8091');
    const pack: Packs = await pb.collection('packs').getOne(packId);
    if(!pack.id) return null;
    return pack.packData;
}

export const socket = io('http://localhost:8080');