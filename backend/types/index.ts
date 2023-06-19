import { Track } from "./SpotifyAPI"

export type Client = {
    id: string,
    currentGame: string | null,
}

export type GameState = {
    /**
     * Pocketbase ID of game. **NOT** the local hash's id.
     */
    id: string,
    /**
     * Initial client list from game creation
     */
    clients: string[],
    /**
     * PB id's of all `currently` connected clients
     */
    connectedClients: string[],
    activePlayers: [string, string],
    /**
     * Songs recieved from client for playback
     */
    queuedSongs: [Track | undefined, Track | undefined],
    pack: {
        id: string,
        name: string,
        data: {
            prompts: string[]
        }
    },
    /**
     * Votes from each client. Stores Client ID as vote towards either active player [0, 1]
     */
    playerVotes: [string[], string[]],
    /**
     * Records **all** players scores
     */
    scores: {
        ids: string[],
        scores: number[],
    },
    /**
     * Incirmented on timerExpirySignal recieved from client
     */
    roundTimerExpiry: 0 | 1 | 2,
    /**
     * Number of Vote Timer Expiry signals recieved from clients. ```game.clients - 2 ``` accounts for all votes. 
     */
    voteTimerExpiry: number,
    /**
     * Current round of game, used to compare against max rounds
     */
    currentRound: number,
    /**
     * Maximum number of rounds allowed for the game
     */
    maxRounds: number,

}

export type VoteCount = {
    id: string,
    score: number
}
