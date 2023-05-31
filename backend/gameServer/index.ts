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

    socket.on('client-ready', (data: Client)=> {
        if(!data || !data.currentGame || !data.id) return;
        
        const game = games.get(data.currentGame);
        if(!game) return;

        //Kick if not allowed in game. 
        if(!game.clients.includes(data.id)) socket.emit('Navigate-To-Home')


        const newClient: Client = {
            id: data.id,
            currentGame: data.currentGame,
        }
        clients.set(newClient.id, newClient); //Add new client

        socket.join(game.id); //Join local game room

        //Push if others already connected, create string[] if not
        if (game.connectedClients) game.connectedClients.push(data.id);
        else game.connectedClients = [data.id];
        
        if(game.connectedClients.length == game.clients.length)  //Display Pack, Select active players & Begin Round, Send Timer
        {
            io.in(game.id).emit("Display-Pack");

            const ids: [string, string] = selectTwoIds(game.clients);

            setTimeout(()=>null, 1200);//Wait for client pack animations
            io.to(game.id).emit("Active-Players", ids);
            setTimeout(()=>null, 1600) //Wait for spin animation to complete
            io.to(game.id).emit("Round-Timer", 60); //1 Minute timer for song requests
        }
    });

    socket.on("Song-Selected", ({
        client,
        track
    }: {
        client: Client,
        track: Track
    }) => {
        if(!client.currentGame) return;
        const game = games.get(client.currentGame);
        if(!game) return;
        if(!game.activePlayers) return;

        if(client.id !== game.activePlayers[1] || game.activePlayers[0]){

        }

        if(!game.queuedSongs){
            
        }
    })

    socket.on("Expired-Select-Timer", ({
        client,
    }: {
        client: Client,
    }) => {
        if(client.currentGame == null) return;

        const game = games.get(client.currentGame);
        if(!game) return;
        if(!game.activePlayers) return;

        if(game.roundTimerExpiry == 2 && (game.queuedSongs[0] == null || game.queuedSongs[1] == null )){
            const winnerId = game.activePlayers[0] === client.id ? game.activePlayers[1] : game.activePlayers[0]; //Select other user for round win
            io.to(client.currentGame).emit("Display-Winner", clients.get(winnerId));
            return;
        }else if (game.roundTimerExpiry == 2){
            io.to(game.id).emit("Song-PlayBack", game.queuedSongs[0]);
            io.to(game.id).timeout(33000).emit("Song-PlayBack", game.queuedSongs[1]);
            io.to(game.id).timeout(33000).emit("Round-Timer", 30); //30 Seconds to vote
            return;
        }
        game.roundTimerExpiry == 0 ? game.roundTimerExpiry = 1 : game.roundTimerExpiry = 2; 
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
        else {
            game.playerVotes[vote].push(client.id);
            io.to(game.id).emit("Vote-Count", [game.playerVotes.length, game.playerVotes.length] as [number, number]);
        };
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

server.listen(8080, "Aux-Battles Game Server" ,()=> {
    console.log("Game Server listening on 8080");
})


function newRound(game: GameState){
    const ids: [string, string] = selectTwoIds(game.clients);

    io.to(game.id).timeout(1200).emit("Active-Players", ids);//Wait for client round winner animation
    io.to(game.id).timeout(100).emit("Round-Timer", 60); //1 Minute timer for song requests
}
