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
        packs: Packs[],
    }
}

interface ExpandedPlayers {
    expand?: {
        players: Users[],
        guests: Guests[],
        pack: Packs
    }
}

export type ExpandedGameData = GameData & ExpandedPlayers;
export type ExpandedLobbyData = LobbyData & ExpandedPlayersPacks;