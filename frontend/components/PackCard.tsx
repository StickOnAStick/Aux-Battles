'use client'
import { Packs } from "@/global/types/Packs";
import { useState } from "react";
import Image from 'next/image';
import { Users } from "@/global/types/Users";
import Pocketbase, { Admin } from "pocketbase";

export default function PackCard({
    pack,
    userModel,
}:{
    pack: Packs,
    userModel: Users | Admin | null, 
}){

    const [error, setError] = useState<Error | undefined>(undefined);

    async function AddPack(pack: Packs, user: Users | null){
        if(!user) {
            const signInError = new Error;
            signInError.name = "notSigned";
            signInError.message = "Please sign in to add packs."
            return setError(signInError);
        }
        if(user.packs.find((id) => id === pack.id) !== undefined){
            const error = new Error;
            error.name = "packOwned";
            error.message = "Pack already owned";
            return setError(error);
        }
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        user.packs.push(pack.id)
        await pb.collection('users').update(user.id, user)
        .then(()=>{
            const success = new Error;
            success.name = "packAdded";
            success.message = "Successfully added pack!";
            return setError(success);
        }).catch((e) =>{
            const error = new Error;
            error.name = "packAddFail";
            error.message = "Could not add pack at this time";
            return setError(error);
        });
    }

    return(
        <div>
            <label htmlFor={`pack_${pack.id}`} className="h-28 md:h-40 flex justify-between bg-base-300 border-2 border-primary-content hover:border-primary hover:border-opacity-70 rounded-xl gap-2 z-20 hover:scale-95 duration-200" >
                <div className="flex gap-5 w-10/12">
                    <figure><Image alt="Pack Image" src={`${process.env.POCKETBASE_URL}/api/files/packs/${pack.id}/${pack.image}`} width={160} height={160} className="h-full w-auto rounded-xl" priority={false}/></figure>
                    <div className="flex flex-col gap-2 w-7/12 p-2">
                        <h1 className="text-xl md:text-4xl font-bold">{pack.name}</h1>
                        <p className="text-sm sm:text-base overflow-hidden">{pack.desc}</p>
                    </div>
                </div>
                <div className="flex flex-col w-1/6 justify-between rounded-xl p-2 h-full">
                    
                    <div className="btn btn-accent p-2 font-bold tracking-wider">
                        Add Pack
                    </div>
                </div>
            </label>
            <input type="checkbox" id={`pack_${pack.id}`} className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box">
                    <h3 className="text-2xl font-bold">{pack.name}</h3>
                    <p className="my-2">{pack.desc}</p>
                    <hr className="border-b border-primary border-opacity-70 my-4"/>
                    <ol className="flex flex-col gap-2 mb-2">
                        {
                        pack && pack.packData.prompts != undefined &&
                            pack.packData.prompts.map((prompt: string, index: number) => {
                            
                                return (
                                    <li key={`${pack.id}_prompt:${index}`} className="bg-base-300 border border-primary border-opacity-30 rounded-xl p-2">{index+1}. {prompt}</li>
                                )
                            })
                        }
                    </ol>
                    {
                        error && (error.name =="notSigned" || error.name =="packOwned" || error.name =="packAddFail") && 
                        <div className="bg-warning rounded-xl p-2 text-center font-extrabold tracking-wider text-xl">
                            {error.message}
                        </div>
                    }
                    {
                        error && (error.name =="packAdded") && 
                        <div className="bg-primary text-accent rounded-xl p-2 text-center font-extrabold tracking-wider text-xl">
                            {error.message}
                        </div>
                    }
                    <div className="modal-action w-full flex justify-between">
                        <label htmlFor={`pack_${pack.id}`} className="btn btn-accent" onClick={()=>setError(undefined)}>Close</label>
                        <button className="btn btn-primary text-accent" onClick={()=>AddPack(pack, userModel as Users | null)}>
                            Add Pack 
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}