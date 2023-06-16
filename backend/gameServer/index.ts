declare var require: any;
import 'react';
import { Server } from 'socket.io'
import * as http from 'http';
import { Client, GameState } from '../types';
import { selectTwoIds } from '../functions/selectTwoIds';
import { Track } from '../types/SpotifyAPI';

const express = require('express')
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

const clients: Map<string, Client> = new Map;
const games: Map<string, GameState> = new Map;

io.on('connection', (socket) => {
    
    socket.on("Create-Game", (data: GameState) => {
        
        games.set(data.id, data);
        data.clients.map((client: string) => {
            clients.set(client, {
                id: client,
                currentGame: data.id
            } as Client)
        })
        const game = games.get(data.id);
        console.log("Successfully created game with id: ", data.id, "\nPlayers: ", data.clients, "\nCreated game: ", game);
    })

    socket.on("Client-Disconnect", ([userId, gameId]: [string, string]) => {
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
            setTimeout(()=> {
                io.of("/").in(game.id).emit("Active-Players", [ids, prompt]);
            }, 500)
            //Wait for spin animation to complete (1.6s)
            setTimeout(()=>{
                io.of("/").in(game.id).emit("Round-Timer", 60); //1 Minute timer for song requests
            }, 660)
        }else if(game.currentRound > 0){ //Add rejoin functionality
            const client: Client | undefined = clients.get(data.id);

        }
    });

    socket.on("Song-Selected", ({clientId, gameId, track}: {clientId: string, gameId: string, track: Track}) => {
        const game = games.get(gameId as string);
        if(!game) return;
        if(clientId !== game.activePlayers[1] && clientId !== game.activePlayers[0]) return;
        //Faster lookup and set
        clientId == game.activePlayers[0] ? game.queuedSongs[0] = track : game.queuedSongs[1] = track;
        const payload = {clientId, track};
        io.in(game.id).emit("Display-Song", payload);
    })

    socket.on("Expired-Select-Timer", (clientId: string) => {
        console.log("Expired timer hit", clientId);
        const client = clients.get(clientId);
        console.log("Client found: ", client);
        if(!client) return;
        if(client.currentGame == null) return;

        const game = games.get(client.currentGame);
        console.log("Game found: ", game);
        if(!game) return;
        if(!game.activePlayers) return;
        
        //Count and set timer expiry signals recieved
        game.roundTimerExpiry == 0 ? game.roundTimerExpiry = 1 : game.roundTimerExpiry = 2; 
        console.log("Make it to round timer checks, current round: ", game.roundTimerExpiry)
        if(game.roundTimerExpiry == 2 && (game.queuedSongs[0] == null || game.queuedSongs[1] == null )){
            console.log("One player didn't select a song");
            const winnerId = game.activePlayers[0] === client.id ? game.activePlayers[1] : game.activePlayers[0]; //Select other user for round win
            io.to(client.currentGame).emit("Display-Winner", winnerId);
            game.roundTimerExpiry = 0;
            return;
        }else if (game.roundTimerExpiry == 2){
            console.log("Both players selected a song")
            io.to(game.id).emit("Song-PlayBack", game.queuedSongs[0]);
            setTimeout(()=> {
                io.to(game.id).timeout(31000).emit("Song-PlayBack", game.queuedSongs[1]);
            }, 31000)
            setTimeout(()=>{
                io.to(game.id).emit("Round-Timer", 30);
            })
            io.to(game.id).timeout(31000).emit("Round-Timer", 30); //30 Seconds to vote
            return;
        }
        return;
    })

    socket.on("Vote", ({
        client,
        vote
    }:{
        client: Client,
        vote: 0 | 1
    })=> {
        if(!client.currentGame) return;
        const game = games.get(client.currentGame);
        if(!game) return; 

        if(game.playerVotes[0].includes(client.id) && vote == 0) return;
        else if(game.playerVotes[1].includes(client.id) && vote == 1) return;
    
        game.playerVotes[vote].push(client.id);
        io.to(game.id).emit("Vote-Count", [game.playerVotes.length, game.playerVotes.length] as [number, number]);
        
    })


    socket.on("Expired-Vote-Timer", ({
        client
    }:{
        client: Client,
    })=>{
        if(client.currentGame == null) return;
        const game = games.get(client.currentGame);
        if(!game) return;

        if(game.voteTimerExpiry == game.clients.length-2) {
            io.to(game.id).emit("Display-Round-Winner", game.playerVotes[0].length > game.playerVotes[1].length ? game.playerVotes[0] : game.playerVotes[1]);
            game.currentRound == game.maxRounds ? io.to(game.id).timeout(2000).emit("Game-Results", game) : newRound(game);
            return;
        }

        return game.voteTimerExpiry = game.voteTimerExpiry + 1;
    })

    


})

server.listen(8080, ()=> {
    console.log("Game Server listening on 8080");
})


function newRound(game: GameState){
    const ids: [string, string] = selectTwoIds(game.clients);

    io.to(game.id).timeout(1200).emit("Active-Players", ids);//Wait for client round winner animation
    io.to(game.id).timeout(100).emit("Round-Timer", 60); //1 Minute timer for song requests
}


function DisplayPack(game: GameState){
    if(game.currentRound == 1 && (game.connectedClients.length == game.clients.length)){
        io.in(game.id).emit("Display-Pack");

        const ids: [string, string] = selectTwoIds(game.clients);
        const prompt: number = Math.floor(Math.random() * game.pack.data.prompts.length);

        //Wait for client pack animations
        io.to(game.id).timeout(1200).emit("Active-Players", [ids, prompt]);
        //Wait for spin animation to complete
        io.to(game.id).timeout(1600).emit("Round-Timer", 60); //1 Minute timer for song requests
    }
}

function removeIdFromArray(arr: string[], id: string): string[] {
    return arr.filter(item => item != id);
}