'use client';
import { Guests } from "@/global/types/Guests";
import { Users } from "@/global/types/Users";
import Image from 'next/image';

export default function ActionCard ({
    typeData,
    host,
    isGame,
    active
}:{
    typeData: Users | Guests | null,
    host: boolean,
    isGame?: boolean,
    active?: boolean, 
}){

    if(!typeData){
        throw new Error('could not find user ');
        return <></>;
    }
    
        return (
        <li key={typeData.username} className={"flex justify-between mx-2 "  + (isGame ? " rounded-lg border border-opacity-50 bg-base-100 border-primary lg:w-80 hover:bg-opacity-60 text-xl " : " border border-primary p-3 rounded-lg border-opacity-20 ") +  (active ? " bg-success border-success border-2 border-opacity-100 text-white font-bold text-2xl tracking-wide bg-opacity-40" : " ")}>
            <div className='flex gap-4 mx-3 my-2'>
                {typeData?.avatar && 
                    <Image src={`http://127.0.0.1:8091/api/files/users/${typeData.id}/${typeData.avatar}`} width={50} height={50} alt="User Img" className='rounded' style={{width: 'auto', height: '100%'}} priority={false}/>
                }
                {typeData.username}
            </div>
            {/* lobby functionality */}
            {!isGame && 
                <div className='flex flex-col justify-center gap-3'>
                    {!host &&
                        <button className="btn btn-md btn-primary font-bold text-accent ">Kick</button>
                    }
                     {/* Ready state will be for Final launch, and only on competitive gamemode  */}
                    {/* {!isGame &&
                        <button className="btn btn-sm xs:btn-md btn-accent font-bold text-primary">Ready</button>
                    }  */}

                </div>
            }
        </li>
        );
    

    
}