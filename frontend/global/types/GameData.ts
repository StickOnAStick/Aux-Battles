import { Record } from "pocketbase";

export interface scores {
    ids: string[],
    scores: number[]
}

export interface ActivePlayers {
    ids: string[]
}

export interface GameData extends Record {
    type: string,
    pack: string,
    chatroom?: string,
    spotApiKey: string,
    round: number,
    players: string[],
    guests: string[],
    scores: scores,
    host: string,
    activeGuests?: string[]
}

export interface GameDataPayload {
    id: string,
    type: string,
    pack: string,
    chatroom?: string,
    spotApiKey: string,
    round: number,
    players?: string[],
    guests?: string[],
    scores: scores,
    host: string,
    activeGuests?: string[]
}