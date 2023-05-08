import SpotifySearch from "@/components/SpotifySearch";
import Spinner from "./Spinner";
import { SpotifyAccessTokenResponse } from "@/global/types/Spotify";


export default function SpinnerSearchWrapper({
    accessToken
}:{
    accessToken: SpotifyAccessTokenResponse,
}){


    return (
        <>
            <SpotifySearch isActive={true} accessToken={accessToken}/>
            <Spinner />
        </>
    )
}