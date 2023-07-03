declare var require: any;
import 'react';
import { Server } from 'socket.io'
import * as https from 'https';
import * as fs from 'fs';
import { Client, GameState, Scores, RoundWinner } from '../types';
import { selectTwoIds } from '../functions/selectTwoIds';
import { Track } from '../types/SpotifyAPI';

const httpsOptions  = {
    cert: fs.readFileSync('/etc/letsencrypt/live/api.aux-battles.app/fullchain.pem', 'utf-8'),
    key: fs.readFileSync('/etc/letsencrypt/live/api.aux-battles.app/privkey.pem', 'utf-8'),
}
const server = https.createServer(httpsOptions)

const io = new Server(server, {
    cors: {
        origin: [
            "https://api.aux-battles.app",
            "https://api.aux-battles-stickonastick.vercel.app",
            "https://www.aux-battles.app",
            "https://www.aux-battles-stickonastick.vercel.app",
            "https://aux-battles.app",
            "https://aux-battles-stickonastick.vercel.app"
        ]
    },
})

const clients: Map<string, Client> = new Map;
const games: Map<string, GameState> = new Map;

const VotingTime = 30;
const SongSelectTime = 60;
const DisplayPack = 10;
const DisplayWinner = 10;

io.on('connection', (socket) => {
    
    socket.on("Create-Game", (data: GameState) => {
        games.set(data.id, data);
        data.clients.map((client: string) => {
            clients.set(client, {
                id: client,
                currentGame: data.id
            } as Client)
        })
    })

    socket.on("Client-Disconnect", ([userId, gameId]: [string, string]) => {
        if(!userId || !gameId) return;
        const game = games.get(gameId);
        const client = clients.get(userId);
        if(!client) return;
        if(!game) return;
        game.connectedClients = removeIdFromArray(game.connectedClients, userId);
        client.currentGame = null;
        return;
    })

    socket.on('Client-Ready', async (data: Client)=> {

        if(!data || !data.currentGame || !data.id) return socket.emit("Navigate-To-Home");
        const game = games.get(data.currentGame);
        if(!game) return socket.emit("Navigate-To-Home");
        if(!game.clients.includes(data.id)) return socket.emit('Navigate-To-Home') //Kick if not allowed in game. 

        //Join Game room
        await socket.join(game.id);
        //Client already existed in database; potentially switching games. 
        const client: Client | undefined = clients.get(data.id);
        if(game.connectedClients.includes(data.id)) return;
        
        if(client !== undefined){
            client.currentGame = data.currentGame;
        }else{
            const newClient: Client = {
                id: data.id,
                currentGame: data.currentGame,
            }
            clients.set(newClient.id, newClient); //Add new client
        }
        // Push Client to game room connected
        game.connectedClients.push(data.id);
        //Display Pack, Select active players & start first round w/timer
        if(game.connectedClients.length == game.clients.length && game.currentRound == 0)  
        {
            io.of("/").in(game.id).emit("Display-Pack");

            const ids: [string, string] = selectTwoIds(game.clients);
            const prompt: number = Math.floor(Math.random() * game.pack.data.prompts.length);
            game.activePlayers = ids;
            //Wait for client pack animations (5s)
            const packAnimationDelay = setTimeout(()=> {
                io.of("/").in(game.id).emit("Active-Players", [ids, prompt]);
                clearTimeout(packAnimationDelay)
            }, 500)
            //Wait for spin animation to complete (1.6s)
            const spinAnimationDelay = setTimeout(()=>{
                io.of("/").in(game.id).emit("Round-Timer", 60); //1 Minute timer for song requests
                clearTimeout(spinAnimationDelay)
            }, 660)
        }else if(game.currentRound > 0){ //Add rejoin functionality
            const client: Client | undefined = clients.get(data.id);
            if(!client?.id) return;
            
            client.currentGame = game.id;
            game.connectedClients.push(client.id);
            //Add ability to catch up on current game state.
            socket.emit("Active-Players", [game.activePlayers, 0]) //Using default prompt until next round
            socket.emit("Round-Timer", 1); //Rejoined clients timer will expire immediately to not interfere with others, but still set display correctly

        }
    });

    socket.on("Song-Selected", ({clientId, gameId, track}: {clientId: string, gameId: string, track: Track}) => {
        if(!clientId || !gameId || !track) return;
        const game = games.get(gameId as string);
        if(!game) return;
        if(clientId !== game.activePlayers[1] && clientId !== game.activePlayers[0]) return;
        //Faster lookup and set
        clientId == game.activePlayers[0] ? game.queuedSongs[0] = track : game.queuedSongs[1] = track;
        const payload = {clientId, track};
        io.in(game.id).emit("Display-Song", payload);
    })

    socket.on("Expired-Select-Timer", (clientId: string) => {

        const client = clients.get(clientId);
        if(!client) return;
        if(client.currentGame == null) return;

        const game = games.get(client.currentGame);
        if(!game) return;
        if(!game.activePlayers) return;
        
        //Count and set timer expiry signals recieved
        game.roundTimerExpiry == 0 ? game.roundTimerExpiry = 1 : game.roundTimerExpiry = 2; 
        if(game.roundTimerExpiry == 2 && game.queuedSongs[0] == null && game.queuedSongs[1] == null){
            if(game.currentRound >= game.maxRounds) return endGame(game);
            return newRound(game);
        }else if(game.roundTimerExpiry == 2 && (game.queuedSongs[0] == null || game.queuedSongs[1] == null )){
            const winnerIndex = game.queuedSongs[0] == null ? 1 : 0;
            const winnerPayload: RoundWinner = {
                winners: winnerIndex ? [undefined, game.activePlayers[1]] : [game.activePlayers[0], undefined],
                tracks: winnerIndex ? [undefined, game.queuedSongs[1]] : [game.queuedSongs[0], undefined]
            };
            game.queuedSongs[0] == null ? 
                game.scores = incrimentScore(game.scores, game.activePlayers[1])
                : game.scores = incrimentScore(game.scores, game.activePlayers[0]);
            
            io.to(client.currentGame).emit("Display-Round-Winner", winnerPayload);
            const displayWinnerDelay = setTimeout(()=>{
                game.currentRound >= game.maxRounds ? endGame(game) : newRound(game);
                clearTimeout(displayWinnerDelay);
            },11000)
            game.roundTimerExpiry = 0;
            return;
        }else if (game.roundTimerExpiry == 2){

            io.to(game.id).emit("Round-Timer", 30);
            io.to(game.id).emit("Song-PlayBack", game.queuedSongs[0]);
            
            const delay1 = setTimeout(()=> {
                io.to(game.id).emit("Round-Timer", 30);
                io.to(game.id).emit("Song-PlayBack", game.queuedSongs[1]);
                clearTimeout(delay1);
            }, 31000)
            
            const delay2 = setTimeout(()=>{
                io.to(game.id).emit("Round-Timer", 30);
                io.to(game.id).emit("Vote-Signal", game.queuedSongs);
                clearTimeout(delay2);
            },62000) //30 Seconds to vote after both songs are played
            game.roundTimerExpiry = 0; //cleanup round timer expiry signal
            return;
        }
        return;
    })

    type Vote = 0 | 1;
    socket.on("Vote", ({
        clientId,
        vote
    }:{
        clientId: string,
        vote: Vote
    })=> {
        const client = clients.get(clientId);
        if(!client) return;
        if(!client.currentGame) return;
        const game = games.get(client.currentGame);
        if(!game) return; 
        //checks for repeated votes
        if(game.playerVotes[0].includes(client.id) && vote == 0) return;
        else if(game.playerVotes[1].includes(client.id) && vote == 1) return;
        
        //Hack to check opposite vote
        if (game.playerVotes[Number(!vote)].includes(client.id)) {
            game.playerVotes[Number(!vote)] = game.playerVotes[Number(!vote)].filter(id => id !== client.id);
        }
        game.playerVotes[vote].push(client.id);
        io.to(game.id).emit("Vote-Count", [game.playerVotes[0].length, game.playerVotes[1].length] as [number, number]);
    })


    
    
    socket.on("Expired-Vote-Timer", (clientId: string)=>{
        if(!clientId) return;
        const client = clients.get(clientId);
        if(!client) return;
        if(client.currentGame == null) return;
        const game = games.get(client.currentGame);
        if(!game) return;

        game.voteTimerExpiry = game.voteTimerExpiry + 1;

        if(game.voteTimerExpiry == game.clients.length-2) {
            if(game.playerVotes[0].length == game.playerVotes[1].length){
                game.scores = incrimentScore(game.scores, game.activePlayers[0]);
                game.scores = incrimentScore(game.scores, game.activePlayers[1]);
                io.to(game.id).emit("Display-Round-Winner", {winners: game.activePlayers, tracks: game.queuedSongs} as RoundWinner)
            }else{
                const winnerPayload: RoundWinner = {
                    winners: game.playerVotes[0].length > game.playerVotes[1].length ? [game.activePlayers[0], undefined] : [undefined, game.activePlayers[1]],
                    tracks: game.playerVotes[0].length > game.playerVotes[1].length ? [game.queuedSongs[0], undefined] : [undefined, game.queuedSongs[1]]
                };
                game.playerVotes[0].length > game.playerVotes[1].length 
                    ? game.scores = incrimentScore(game.scores, game.activePlayers[0]) 
                    : game.scores = incrimentScore(game.scores, game.activePlayers[1]);

                io.to(game.id).emit("Display-Round-Winner", winnerPayload);
            }
            
            const newRoundDelay = setTimeout(()=> {
                game.currentRound >= game.maxRounds ? endGame(game) : newRound(game);
                clearTimeout(newRoundDelay)
            }, 11000)
            
            return;
        }
        return;
    })

    function newRound(game: GameState){
        
        ++game.currentRound;
        const ids: [string, string] = selectTwoIds(game.clients);
        const prompt: number = Math.floor(Math.random() * game.pack.data.prompts.length);
        //Cleanup old values and set new activeplayers
        game.activePlayers = ids;
        game.playerVotes = [[] as string[],[] as string[]];
        game.queuedSongs = [ undefined, undefined];
        game.voteTimerExpiry = 0;
        io.to(game.id).emit("Score-Update", [game.scores.ids, game.scores.scores] as [string[], number[]]);
        io.to(game.id).emit("Active-Players", [ids,prompt]);//Wait for client round winner animation
        io.to(game.id).emit("Round-Timer", 60); //1 Minute timer for song requests
    }

    function endGame(game: GameState){
        for(const clientId in game.clients){
            clients.delete(clientId);
        }
        const winnerIndex = game.scores.scores.indexOf(Math.max(...game.scores.scores));
        if(winnerIndex == -1){ () => {
            // const pb = new PocketBase('http://127.0.0.1:8091');
            // try{
            // await pb.collection('games').delete(game.id);
            // }catch(e){console.log("Failed to delete game: ", e)}
            games.delete(game.id);
            io.to(game.id).emit("Navigate-To-Home");
            return;
        }}

        const winnerId = game.scores.ids[winnerIndex];
        io.to(game.id).emit("Game-Winner", [winnerId, game.scores.scores[winnerIndex]] as [string, number]);
        
        const endGameDelay = setTimeout(async ()=>{
            io.to(game.id).emit("Navigate-To-Home");
            // const pb = new PocketBase('http://127.0.0.1:8091');
            // try{
            //     await pb.collection('games').delete(game.id);
            // }catch(e){console.log("Failed to delete game: ", e)}
            games.delete(game.id);
            clearTimeout(endGameDelay);
        },10000)
    }

})

server.listen(8080, ()=> {
    console.log("Game Server listening on 8080");
    setInterval(()=>{
        const dateTime = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});
        console.log("Number of games running: ", games.size, "Number of joined clients: ", clients.size, "\nTime: ", dateTime);
    }, 1000*60*1)
})

function removeIdFromArray(arr: string[], id: string): string[] {
    return arr.filter(item => item != id);
}

/**
 * Increase the score of a given player 
 * @param score The given games scores object
 * @param id The ID which you want to incriment
 * @param amount Optional amount to incriment score by
 * @returns Updated scores object for given game.
*/
function incrimentScore(score: Scores, id: string, amount?: number): Scores{
    const {ids, scores} = score;
    const index = ids.indexOf(id);

    if(index !== -1) scores[index] += 1;
    return score;
}

// function DisplayPack(game: GameState){
//     if(game.currentRound == 1 && (game.connectedClients.length == game.clients.length)){
//         io.in(game.id).emit("Display-Pack");

//         const ids: [string, string] = selectTwoIds(game.clients);
//         const prompt: number = Math.floor(Math.random() * game.pack.data.prompts.length);

//         //Wait for client pack animations
//         io.to(game.id).timeout(1200).emit("Active-Players", [ids, prompt]);
//         //Wait for spin animation to complete
//         io.to(game.id).timeout(1600).emit("Round-Timer", 60); //1 Minute timer for song requests
//     }
// }

