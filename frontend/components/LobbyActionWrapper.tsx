import LobbyActionHeader from './LobbyActionHeader';
import LobbyPlayerList from './LobbyPlayerList';
import { ExpandedLobbyData } from '@/global/types/Unions';

export default function LobbyActionWrapper({
    lobbyId,
    data, //inital state
    className,
    localToken
}:{
    lobbyId: string,
    data: ExpandedLobbyData,
    className?: string,
    localToken: string,
}){

    return (
        <div className={className + " flex justify-center mt-5 text-primary h-full flex-grow"}>
            <div className=" bg-base-300 border-2 border-primary-content rounded-lg w-full sm:w-10/12 md:w-2/3 p-5 flex flex-col justify-between">
                <div>
                    {/* Game Info */}
                    <LobbyActionHeader data={data} localToken={localToken}/>
                    {/* User List */}
                    <LobbyPlayerList initalState={data} localToken={localToken}/>
                </div>
                {/* Sharing */}
                <div className="flex justify-center text-center">
                    <div className='flex flex-col gap-1'>
                        <span className='text-3xl xs:text-4xl font-bold tracking-wider'>{data?.pass}</span>
                        <span className='mb-3 text-sm text-center'>Share this with your friends!</span>
                        <div className='w-full text-center'>
                            {/* Todo: For beta launch, have sharing feature complete  */}
                            <button className='btn btn-accent text-white font-extrabold tracking-wider text-3xl'>Share</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}