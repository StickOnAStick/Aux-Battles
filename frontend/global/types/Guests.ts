import { Record } from "pocketbase";

export interface Guests extends Record {
    username: string,
    currentLobby?: string,
    currentGame?: string,
    token: string,
    score?: number
}

export interface GuestsPayload {
    id?: string,
    username?: string,
    currentLobby?: string,
    currentGame?: string,
    token?: string,
    score?: number
}

