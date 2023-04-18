import { Record } from "pocketbase";
import { Guests } from "./Guests";
import { Packs } from "./Packs";
import { Users } from "./Users";

export interface LobbyData extends Record {
        chatroom: string | null,
        pass: string,
        players: Users[],
        gameType: boolean,
        packs: Packs[],
        host: string,
        guests: Guests[]
}

export interface LobbyPayloadData {
        id?: string,
        chatroom?: string | null,
        pass?: string,
        players: string[],
        gameType?: boolean,
        packs?: string[],
        host?: string,
        guests: string[]
}

