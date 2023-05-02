import { Guests } from "./Guests";
import { LobbyData } from "./LobbyData";
import { Users } from "./Users";
import { Packs } from "./Packs";
import { GameData } from "./GameData";

export type UsersOrGuests = Users | Guests;

interface ExpandedPlayersPacks {
    expand?: {
        players?: Users[],
        guests?: Guests[],
        pakcs: Packs[],
    }
}

interface ExpandedPlayers {
    expand?: {
        players?: Users[],
        guests?: Guests[],
    }
}

export type ExapandedGameData = GameData & ExpandedPlayers;
export type ExpandedLobbyData = LobbyData & ExpandedPlayersPacks;