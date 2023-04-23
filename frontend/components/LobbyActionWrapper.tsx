import { LobbyData } from '@/global/types/LobbyData';
import { Users } from '@/global/types/Users';
import { Guests } from '@/global/types/Guests';
import ActionCard from './ActionCard';
import LobbyActionHeader from './LobbyActionHeader';

export default function LobbyActionWrapper({
    lobbyId,
    data,
    className,
    localToken
}:{
    lobbyId: string,
    data: LobbyData,
    className?: string,
    localToken?: string,
}){
    
    return (
        <div className={className + " flex justify-center mt-5 text-primary h-full flex-grow"}>
            <div className=" bg-base-300 border-2 border-primary-content rounded-lg w-full sm:w-10/12 md:w-2/3 p-5 flex flex-col justify-between">
                <div>
                    {/* Game Info */}
                    <LobbyActionHeader lobbyId={lobbyId} localToken={localToken} hostId={data.host} packs={data?.expand.packs.at(0)}/>
                    {/* User List */}
                    <div className='font-bold text-2xl flex flex-col gap-4 mt-3 mb-5'>
                        Players
                        <ul className=' font-medium rounded-md p-3 text-xl flex flex-col gap-5'>
                            {/**Signed users */}
                            {data?.expand.players?.map((user: Users) => {
                                return (
                                    <ActionCard typeData={user} key={user.id} host={ user.id === data.host }/>
                                );
                            })}
                            {/**Guests */}
                            {data?.expand.guests?.map((guest: Guests) => {
                                return (
                                   <ActionCard typeData={guest} key={guest.id} host={ guest.id === data.host }/>
                                );
                            })}  
                        </ul>
                    </div>
                </div>
                {/* Sharing */}
                <div className="flex justify-center">
                    <div className='flex flex-col gap-3'>
                        <span className=" font-semibold tracking-wide text-2xl">Code: <span className='text-2xl xs:text-4xl font-bold'>{data?.pass}</span></span>
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