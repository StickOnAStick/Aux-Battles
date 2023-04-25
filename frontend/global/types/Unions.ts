import { Guests } from "./Guests";
import { LobbyData } from "./LobbyData";
import { Users } from "./Users";
import { Packs } from "./Packs";

export type UsersOrGuests = Users | Guests;

interface ExpandedPlayers {
    expand: {
        players: Users[],
        guests: Guests[],
        pakcs: Packs[],
    }
}
export type ExpandedLobbyData = LobbyData & ExpandedPlayers;