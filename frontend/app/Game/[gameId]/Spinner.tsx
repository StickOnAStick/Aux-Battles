'use client';
import { useEffect, useState } from "react";
import { socket } from "@/global/functions/socket";
import { Track } from "@/global/types/SpotifyAPI";
import VoteCard from "@/components/VoteCard";
import SongPlayBackCard from "@/components/SongPlayBackCard";
import { StatefulRoundWinners } from "@/global/functions/game";
import RoundWinnerCard from "@/components/RoundWinnerCard";
import Wheel from "@/components/Wheel";
import { UsersOrGuests } from "@/global/types/Unions";

function vote(clientId: string, vote: 0 | 1, allowed: boolean){
  if(allowed) socket.emit("Vote", {clientId: clientId, vote: vote} as {clientId: string, vote: 0 | 1})
  return;
}

export default function Spinner({
  prompts,
  selected,
  userId,
  votingAllowed,
  roundWinners,
  gameWinner
}:{
  prompts: string[],
  selected: number,
  userId: string,
  votingAllowed: boolean,
  roundWinners: StatefulRoundWinners,
  gameWinner: [UsersOrGuests | undefined, number]
}){
    
    const [songPlayBack, setSongPlayBack] = useState<Track | undefined>(undefined);
    const [voteTracks, setVoteTracks] = useState<[Track | undefined, Track | undefined]>([undefined, undefined]);
    const [votes, setVotes] = useState<[number, number]>([0,0]);
    const [spinWheel, setSpinWheel] = useState<boolean>(false);
    
    useEffect(()=>{
      socket.on("Active-Players", ()=>{
        setSpinWheel(true);
        const wheelSpinDelay = setTimeout(()=>{ setSpinWheel(false); clearTimeout(wheelSpinDelay)},1000)
      })
      
      socket.on("Song-PlayBack", (track: Track) => {
        setSongPlayBack(track);
      });
      socket.on("Vote-Signal", ([track1, track2]: [Track, Track]) => {
        setVoteTracks([track1, track2]);
        setSongPlayBack(undefined);
        const delay = setTimeout(()=>{
            setVoteTracks([undefined, undefined]);
            if(votingAllowed){ socket.emit("Expired-Vote-Timer", userId); }
            clearTimeout(delay);
        },30000);
      });
      socket.on("Vote-Count", (votes: [number, number]) => {
        setVotes(votes);
      });
      socket.on("Display-Round-Winner", () =>{
        setVotes([0,0]); //clear votes for next round
      });
    },[votingAllowed, songPlayBack, userId])

    return (
        <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
          {
            gameWinner[0] != undefined ?
            <div className="flex flex-col gap-2 p-4 rounded-lg border-2 border-primary">
                <p>Game Winner:</p>
                <p>{gameWinner[0].username}</p>
                <p>Score: {gameWinner[1]}</p>
            </div>
            :
            <>
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
                  <div className="flex flex-col">
                    {/* <WheelSpinner spinWheel={spinWheel} segColors={segmentColors} segments={prompts} winningSegment={prompts[selected]} onFinished={()=>console.log("Finished spin")} isOnlyOnce={false} size={280} upDuration={100} downDuration={1000} fontFamily="arial" buttonText="Spin" primaryColor="#f5f5f4" contrastColor="#f5f5f4" width={600} height={600}/> */}
                    <Wheel options={prompts} winningIndex={selected} spin={spinWheel}/>
                    <div className="text-lg text-center mx-2">
                      {prompts[selected]}
                    </div>
                  </div>
                }
                </>
              }
              </>
            }
            </>
          }
          
          
          
        </div>
    );
}
