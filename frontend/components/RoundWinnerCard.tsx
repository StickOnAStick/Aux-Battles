import { Track } from "@/global/types/SpotifyAPI";
import PocketBase from 'pocketbase';
import Image from 'next/image'
import { UsersOrGuests } from "@/global/types/Unions";

export default function RoundWinnerCard({
    user,
    track
}:{
    user: UsersOrGuests,
    track: Track
}){

    return (
        <div className="base-300 rounded-lg border border-primary w-[150px] sm:w-[300px]">
            <Image src={track.album.images[0].url} height={300} width={300} alt="Album Cover"/>
            <p className="text-sm text-center">{track.name}</p>
            <p className="mt-2 text-center text-sm">{user.username}</p>
        </div>
    );


}