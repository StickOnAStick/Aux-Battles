import { Record } from "pocketbase";
import { Guests } from "./Guests";
import { Packs } from "./Packs";
import { Users } from "./Users";

export interface GameData extends Record {
    type: boolean,
    pack: Packs,
    chatroom?: string,
    spotApiKey: string,
    round: number,
    players: Users[],
    guests: Guests[],
}