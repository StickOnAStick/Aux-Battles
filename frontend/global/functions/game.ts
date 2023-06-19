import { Track } from "../types/SpotifyAPI";
export function selectTwoIds(ids: string[]): string[] {
    const randIndex1 = Math.floor(Math.random() * ids.length);
    let randIndex2 = Math.floor(Math.random() * ids.length);

    //Ensure no index collisions
    while(randIndex2 === randIndex1) randIndex2 = Math.floor(Math.random() * ids.length);

    return [ids[randIndex1], ids[randIndex2]];
}

export type RoundWinner = {
    winners: [
        id: string | undefined,
        id: string | undefined,
    ],
    tracks: [
        track: Track | undefined,
        track: Track | undefined 
    ]
}