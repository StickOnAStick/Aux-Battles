import { Record } from "pocketbase";

export interface Guests extends Record {
    username: string,
    currentLobby: string,
    currentGame: string,
}

export interface GuestsPayload {
    id?: string,
    username: string,
    currentLobby: string,
    currentGame: string,
}

