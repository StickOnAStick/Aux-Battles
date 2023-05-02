import { Record } from "pocketbase";

export interface scores {
    ids: string[],
    scores: number[]
}

export interface GameData extends Record {
    type: string,
    pack: string,
    chatroom?: string,
    spotApiKey: string,
    round: number,
    players: string[],
    guests: string[],
    activePlayers: string[],
    activeGuests: string[],
    scores: scores
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
    activePlayers?: string[],
    activeGuests?: string[],
    scores: scores,
}