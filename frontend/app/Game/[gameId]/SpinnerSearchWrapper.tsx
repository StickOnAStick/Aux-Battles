'use client';
import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import {useState} from 'react';


export default function SpinnerSearchWrapper(){

    const [displaySpotify, setDisplaySpotify] = useState<boolean>(true);

    return (
        <>
            <SpotifySearch isActive={displaySpotify}/>
            <Spinner />
        </>
    )
}