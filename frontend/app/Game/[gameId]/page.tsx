import GameState from "./GameState";
import SpotifySearch from '@/components/SpotifySearch';
import LeaveGame from "./LeaveGame";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Game({
    params
}:{
    params: {
        gameId: string,
    }
}){
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if(!token){
        new Error('Please enable cookies to continue');
        return redirect('/');
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <LeaveGame/>
            <div className='absolute top-20 w-full flex justify-center'>
                <SpotifySearch isActive={true}/>
            </div>
            <div className="flex w-full text-6xl font-extrabold justify-center items-center h-full">Spinner</div>
            <GameState gameId={params.gameId} localToken={token.value}/>
        </div>
    );
}