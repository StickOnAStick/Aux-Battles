import { useEffect, useState } from "react";
import { socket } from "@/global/functions/socket";
import { Track } from "@/global/types/SpotifyAPI";
import Image from 'next/image';

export default function Spinner({
  prompts,
  selected
}:{
  prompts: string[],
  selected: number,
}){
    
    const [songPlayBack, setSongPlayBack] = useState<Track | undefined>(undefined);

    useEffect(()=>{
      socket.on("Song-PlayBack", (track: Track) => {
        console.log("Song-Playback Hit!", track);
        setSongPlayBack(track);
      });
      socket.on("Vote-Signal", ([track1, track2]: [Track, Track]) => {
            
        setTimeout(()=>{
            socket.emit("Expired-Vote-Timer");
        },30000)
      });
    },[])

    return (
        <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
            {
              songPlayBack ?  
              <div className=" bg-base-300 border border-primary rounded-lg">
                <Image className="rounded-md" src={songPlayBack.album.images[1].url} height={300} width={300} alt="album cover"/>
                <div className="flex flex-col justify-center py-1">
                  <span className="text-lg text-center">{songPlayBack.name}</span>
                  <span className="text-base text-center font-thin">{songPlayBack.artists[0].name}</span>
                </div>
                <iframe src={songPlayBack.preview_url} allow="autoplay" className="hidden"/>
                {/* <video autoPlay controls className="hidden"/>
                  <source src={songPlayBack.preview_url} type="audio/mpeg"></source>
                  Your Browser does not support audio playback.
                </video> */}
              </div>  
              :
              <>
              {prompts[selected]}
              </>
            }
        </div>
    );
}