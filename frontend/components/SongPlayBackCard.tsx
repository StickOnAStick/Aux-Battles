import { Track } from "@/global/types/SpotifyAPI"
import Image from 'next/image';

export default function SongPlayBackCard({
    track
}:{
    track: Track
}){
    return(
    <div className=" bg-base-300 border border-primary rounded-lg w-[300px]">
        <Image className="rounded-md" src={track.album.images[1].url} height={300} width={300} alt="album cover"/>
        <div className="flex flex-col flex-wrap justify-center py-1">
            <div className="text-lg text-center">{track.name}</div>
            <span className="text-base text-center font-thin">{track.artists[0].name}</span>
        </div>
        <iframe src={track.preview_url} allow="autoplay" className="hidden"/>
    </div>  
    );
}