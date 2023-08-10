import { Record } from "pocketbase";
import { Guests } from "./Guests";
import { Packs } from "./Packs";
import { Users } from "./Users";

export interface LobbyData extends Record {
        chatroom: string | null,
        pass: string,
        gameType: boolean,
        packs: string[],
        host: string,
        players: string[],
        guests: string[],
        gameStart: boolean,
        selectedPack: string,
}

export interface LobbyPayloadData {
        id?: string,
        chatroom?: string | null,
        pass?: string,
        players: string[],
        gameType?: boolean,
        packs?: string[],
        host?: string,
        guests: string[],
        gameStart?: boolean,
        selectedPack: string,
}

