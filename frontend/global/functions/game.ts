export function selectTwoIds(ids: string[]): string[] {
    const randIndex1 = Math.floor(Math.random() * ids.length);
    let randIndex2 = Math.floor(Math.random() * ids.length);

    //Ensure no index collisions
    while(randIndex2 === randIndex1) randIndex2 = Math.floor(Math.random() * ids.length);

    return [ids[randIndex1], ids[randIndex2]];
}