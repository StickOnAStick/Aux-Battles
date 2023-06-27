'use client';
import { useEffect, useState } from "react";
import { socket } from "@/global/functions/socket";
import { Track } from "@/global/types/SpotifyAPI";
import Image from 'next/image';
import VoteCard from "@/components/VoteCard";
import SongPlayBackCard from "@/components/SongPlayBackCard";
import { UsersOrGuests } from "@/global/types/Unions";
import { StatefulRoundWinners } from "@/global/functions/game";
import RoundWinnerCard from "@/components/RoundWinnerCard";

function vote(clientId: string, vote: 0 | 1, allowed: boolean){
  if(allowed) socket.emit("Vote", {clientId: clientId, vote: vote} as {clientId: string, vote: 0 | 1})
  return;
}

export default function Spinner({
  prompts,
  selected,
  userId,
  votingAllowed,
  roundWinners
}:{
  prompts: string[],
  selected: number,
  userId: string,
  votingAllowed: boolean,
  roundWinners: StatefulRoundWinners
}){
    
    const [songPlayBack, setSongPlayBack] = useState<Track | undefined>(undefined);
    const [voteTracks, setVoteTracks] = useState<[Track | undefined, Track | undefined]>([undefined, undefined]);
    const [votes, setVotes] = useState<[number, number]>([0,0]);
    
  

    useEffect(()=>{
      socket.on("Song-PlayBack", (track: Track) => {
        console.log("Song-Playback Hit!", track);
        setSongPlayBack(track);
      });
      socket.on("Vote-Signal", ([track1, track2]: [Track, Track]) => {
        setVoteTracks([track1, track2]);
        setSongPlayBack(undefined);
        setTimeout(()=>{
            setVoteTracks([undefined, undefined]);
            console.log("Emitting Expired-Vote-Timer from spinner.tsx")
            if(votingAllowed){ socket.emit("Expired-Vote-Timer", userId); }
        },30000);
      });
      socket.on("Vote-Count", (votes: [number, number]) => {
        setVotes(votes);
      });
      socket.on("Display-Round-Winner", () =>{
        setVotes([0,0]); //clear votes for next round
      });
    },[votingAllowed, songPlayBack])

    return (
        <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
          {
            (roundWinners.winners[0] || roundWinners.winners[1]) ?
            <div className="flex-col justify-center">
              <p className="mb-2">Winner</p>
              <div className="flex gap-5">
                {
                  roundWinners.winners[0] && roundWinners.tracks[0] &&
                  <RoundWinnerCard user={roundWinners.winners[0]} track={roundWinners.tracks[0]}/>
                }
                {
                  roundWinners.winners[1] && roundWinners.tracks[1] &&
                  <RoundWinnerCard user={roundWinners.winners[1]} track={roundWinners.tracks[1]}/>
                }
              </div>
            </div>
            :
            <>
            {
              (voteTracks[0] && voteTracks[1]) ?
              <div className="flex gap-5">
                
                <VoteCard track={voteTracks[0]} voteFunc={() => vote(userId, 0, votingAllowed)} voteCount={votes[0]}/>
                <VoteCard track={voteTracks[1]} voteFunc={() => vote(userId, 1, votingAllowed)} voteCount={votes[1]}/>
              </div> 
              :
              <>
              {
                songPlayBack ?  
                <SongPlayBackCard track={songPlayBack}/>
                :
                <div className="text-lg text-center mx-2">
                {prompts[selected]}
                </div>
              }
              </>
            }
            </>
          }
        </div>
    );
}