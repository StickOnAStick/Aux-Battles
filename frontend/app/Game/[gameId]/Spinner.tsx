import { useEffect, useState } from "react";
import { socket } from "@/global/functions/socket";
import { Track } from "@/global/types/SpotifyAPI";
import Image from 'next/image';
import { RoundWinner } from "@/global/functions/game";
import VoteCard from "@/components/VoteCard";
import SongPlayBackCard from "@/components/SongPlayBackCard";

function vote(clientId: string, vote: 0 | 1, allowed: boolean){
  if(allowed) socket.emit("Vote", {clientId: clientId, vote: vote} as {clientId: string, vote: 0 | 1})
  return;
}

export default function Spinner({
  prompts,
  selected,
  userId,
  votingAllowed
}:{
  prompts: string[],
  selected: number,
  userId: string,
  votingAllowed: boolean
}){
    
    const [songPlayBack, setSongPlayBack] = useState<Track | undefined>(undefined);
    const [voteTracks, setVoteTracks] = useState<[Track | undefined, Track | undefined]>([undefined, undefined]);
    const [votes, setVotes] = useState<[number, number]>([0,0]);
    const [roundWinner, setRoundWinner] = useState<RoundWinner>({winners: [undefined, undefined], tracks: [undefined, undefined]});

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
            socket.emit("Expired-Vote-Timer", userId);
        },30000);
      });
      socket.on("Vote-Count", (votes: [number, number]) => {
        setVotes(votes);
      });
      socket.on("Display-Round-Winner", () => {
        
      });
    },[userId])

    return (
        <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
          {
            (roundWinner.winners[0] || roundWinner.winners[1]) ?

            <div className="flex gap-5">
              
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