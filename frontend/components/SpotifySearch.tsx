'use client'
import { IoSearch } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SpotifyAccessTokenResponse } from '@/global/types/Spotify';
import Image from 'next/image';
import { Track } from '@/global/types/SpotifyAPI';
import { socket } from '@/global/functions/socket';


async function searchSpotify(query: string, accessToken: SpotifyAccessTokenResponse, setSearchResults: React.Dispatch<React.SetStateAction<any>>){
    const encodedQuery = encodeURIComponent(query).replace(/'/g, '%27').replace(/%20/g, '+');
    //console.log("\nEncoded Query: ", encodedQuery, "\n\nAccess Token: ", accessToken.access_token);
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=20`,{
        method: "GET",
        headers: {
            "Authorization": 'Bearer ' + accessToken.access_token
        }
    });

    const { tracks } = await searchResponse.json();
    //console.log("\nSearch Response: ", searchResponse, "\n\nTracks: ", tracks)
    return setSearchResults(tracks);

}

function sendTrackToGameServer(clientId: string, gameId: string, track: Track){
    const payload = {clientId, gameId, track};
    socket.emit("Song-Selected", payload)
}

export default function SpotifySearch({
    isActive,
    accessToken,
    gameId,
    localUserId,
    prompt
}:{
    isActive: boolean,
    accessToken: SpotifyAccessTokenResponse,
    gameId: string,
    localUserId: string,
    prompt: string | undefined
}
){
    const [search, setSearch] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any>(null);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(()=>{
        setScreenWidth(window.innerWidth)
        if(!isActive){
            setSearch('');
            setSearchResults(null);
        }
        return () => {
            setSearch('');
            setSearchResults(null);
        }
    },[isActive])
    


    return (
        <motion.div className={'absolute top-16 w-full flex justify-center max-h-[75%] md:max-h-[66%]'}
            initial={{scale: 0}}
            animate={{ scale: isActive ? 1 : 0,
                       visibility: isActive ? 'visible': 'collapse' 
                    }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 25
            }}>
            <div className="p-4 rounded-md border border-primary border-opacity-60 bg-base-300 w-full md:w-3/4 lg:w-1/2">
                {/* Search */}
                <div className='flex gap-2 items-center m-0 border-b pb-2' >
                    <input type='text' onChange={(e)=>setSearch(e.target.value)} name="search" placeholder='Search Spotify..' className='rounded-lg px-2 py-2 text-xl lg:py-3 w-full font-extrabold lg:text-2xl'/>
                    <button type='submit' className='btn btn-ghost p-1' onClick={()=> searchSpotify(search, accessToken, setSearchResults)}>
                        <IoSearch size={32}/>
                    </button>
                </div>
                {/* Results */}
                <div className='relative pt-2 mt-2 grid grid-cols-3 lg:grid-cols-3 gap-2 overflow-y-scroll overflow-x-hidden sm:max-h-[80%] max-h-[82%] scrollbar mb-2'>
                    { searchResults &&
                    searchResults.items.map((track: Track )=> {
                        if(track.preview_url == null) return;
                        return (
                        <button key={track.id}
                                onClick={()=>sendTrackToGameServer(localUserId, gameId, track)}
                                className='flex flex-col items-center bg-base-200 hover:bg-primary hover:bg-opacity-10 border border-primary border-opacity-20 rounded-lg p-2 text-center '>
                            
                            {/* Track album.images[2] is 64x64px, album.images[1] is 300x300px, album.images[0] 600x600px*/}
                            {/* Annoying fix for type */}
                            {(track.album.images[1].height && track.album.images[2].height && track.album.images[1].width && track.album.images[2].width ) && 
                            <Image src={track.album.images[1].url} height={screenWidth > 630 ? track.album.images[1].height : track.album.images[2].height} width={screenWidth > 630 ? track.album.images[1].width : track.album.images[2].width} alt='album cover' />
                            }
                            
                            <div className='flex flex-col text-xs justify-between h-full mt-2'>
                                <span className='font-bold tracking-wide sm:text-base'>{track.name}</span>
                                <span className='font-extrabold justify-end'>{track.artists[0].name}</span>
                                <Image src={"./frontend/public/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Green.png"} width={20} height={20} alt='Spotify'/>
                            </div>
                        </button>
                        );
                    })}
                </div>
                {prompt && 
                <div className='border-t-2 border-primary font-bold text-center text-2xl max-h-[20%]'>
                    <div className='bg-accent text-white rounded-lg mt-2 text-center'>
                        {prompt}
                    </div>
                </div>}
                
            </div>
        </motion.div>
    );

}