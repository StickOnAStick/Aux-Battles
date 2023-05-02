import { Record } from "pocketbase";
import { Packs } from "./Packs";

export interface Users extends Record{
    id: string,
    avatar: string,
    games: number,
    won: number,
    spotifyId: string,
    topGenre: string,
    topArtist: string,
    currentLobby: string,
    currentGame: string,
    packs: string[],
    username: string,
}