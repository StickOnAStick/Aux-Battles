'use client';
import { Guests } from "@/global/types/Guests";
import { Users } from "@/global/types/Users";
import Image from 'next/image';

export default function ActionCard ({
    typeData,
    host,
    isGame,
    active,
    score
}:{
    typeData: Users | Guests | null,
    host: boolean,
    isGame?: boolean,
    active?: boolean, 
    score?:number
}){

    if(!typeData){
        throw new Error('could not find user ');
        return <></>;
    }
    return (
    <li key={typeData.username} className={" justify-between mx-2 "  + (isGame ? " rounded-lg border-2 border-opacity-10`0 bg-base-300 lg:w-80 hover:bg-opacity-60 text-xl " : " border border-primary p-3 rounded-lg border-opacity-20 ") +  (active ? "border-2 border-accent font-bold text-2xl tracking-wide bg-opacity-40" : " border-primary  ")}>
        <div className="flex justify-between">
            <div className='flex gap-4 mx-3 my-2 font-extrabold tracking-wide'>
                {typeData?.avatar && 
                    <Image src={`${process.env.POCKETBASE_URL}/api/files/users/${typeData.id}/${typeData.avatar}`} width={50} height={50} alt="User Img" className='rounded' style={{width: 'auto', height: '100%'}} priority={false}/>
                }
                {typeData.username}
            </div>
            {/* lobby functionality */}
            {!isGame && 
                <div className='flex flex-col justify-center gap-3'>
                    {/* {!host &&
                        <button className="btn btn-md btn-primary font-bold text-accent">Kick</button>
                    } */}
                    {/* Ready state will be for Final launch, and only on competitive gamemode  */}
                    {/* {!isGame &&
                        <button className="btn btn-sm xs:btn-md btn-accent font-bold text-primary">Ready</button>
                    }  */}
                </div>
            }
            {/* Game Functionality */}
            {isGame && 
                <div className="font-extrabold text-2xl">
                    {score}
                </div>
            }
        </div>
        
    </li>
    );
}