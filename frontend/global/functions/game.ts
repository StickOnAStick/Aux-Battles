import { Track } from "../types/SpotifyAPI";
import { UsersOrGuests } from "../types/Unions";
export function selectTwoIds(ids: string[]): string[] {
    const randIndex1 = Math.floor(Math.random() * ids.length);
    let randIndex2 = Math.floor(Math.random() * ids.length);

    //Ensure no index collisions
    while(randIndex2 === randIndex1) randIndex2 = Math.floor(Math.random() * ids.length);

    return [ids[randIndex1], ids[randIndex2]];
}

export type RoundWinner = {
    winners: [
        string | undefined,
        string | undefined,
    ],
    tracks: [
        Track | undefined,
        Track | undefined 
    ]
     
}

export type StatefulRoundWinners = {
    winners: [
        UsersOrGuests | undefined,
        UsersOrGuests | undefined
    ],
    tracks: [
        Track | undefined,
        Track | undefined
    ]

}