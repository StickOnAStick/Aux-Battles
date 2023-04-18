import GameState from "./GameState";
import SpotifySearch from '@/components/SpotifySearch';
import SpinnerWrapper from "./Spinner";


export default function Game({
    params
}:{
    params: {
        gameId: string,
    }
}){
    return (
        <div className="w-full h-full flex justify-center">
            
            <SpinnerWrapper>
                <SpotifySearch />
                {/* Insert spinner here */}
            </SpinnerWrapper>
            <GameState/>
        </div>
    );
}