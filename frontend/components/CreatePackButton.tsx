'use client'
import { Users } from '@/global/types/Users';
import { Admin } from 'pocketbase';
import { FaPlus } from 'react-icons/fa'
import { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import Pocketbase from 'pocketbase';
import { PackData } from '@/global/types/Packs';


async function submitPack(userModel: Users | Admin | null, title: string, prompts: string[], setError: React.Dispatch<React.SetStateAction<Error | null>>){
    if(!userModel){
        const error = new Error;
        error.name = "NotSigned";
        error.message = "Sign In to create pack"
        setError(error);
        return;
    }
    if(title.length < 3){
        const error = new Error;
        error.name = "Title"
        error.message = "Enter a full title!"
        setError(error);
        return;
    }

    prompts.filter(function(prompt){ return /\s/.test(prompt);})
    if(prompts.length < 6) {
        const error = new Error;
        error.name = "empty";
        error.message = "Enter prompts to create pack"
        setError(error);
        return;
    }
    
    const pb = new Pocketbase(process.env.POCKETBASE_URL)

}


export default function CreatePackButton({
    userModel
}:{
    userModel: Users | Admin | null;
}){
    const [title, setTitle] = useState<string>('');
    const [promptList, setPromptList] = useState<string[]>(new Array<string>(6));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]
        if(!file) return setSelectedImage(null);
        
        const reader = new FileReader();

        reader.onloadend = () => setSelectedImage(reader.result as string);
        reader.readAsDataURL(file);
    }

    function incrimentArr(prev: string[]): string[] {
        const update = new Array<string>(prev.length+2);
        for(let i = 0; i < prev.length; i++){
            update[i] = prev[i]
        }
        prev.push('')
        prev.push('')
        
        return update 
    }
    function decrimentArr(prev: string[]): string[] {
        const update = new Array<string>(prev.length-2);
        for(let i = 0; i < update.length; i++){
            update[i] = prev[i]
        }
        
        return update 
    }

    useEffect(()=>{
        return () => {
            setSelectedImage(null);
            setPromptList(new Array<string>(6));
        }
    },[])

    return (
        <div className="tooltip tooltip-bottom min-h-full h-full w-2/12 md:w-1/12" data-tip="Create a Pack">
                <label htmlFor="CreatePack" className="btn border border-primary-content bg-base-300 min-h-full h-full w-full text-primary"><FaPlus/></label>
                <input type="checkbox" id="CreatePack" className="modal-toggle"/>
                <div className="modal">
                    <div className="modal-box bg-base-300 border border-primary border-opacity-30">
                        <h3 className="font-bold text-2xl">Create Pack</h3>
                        <div className="border-b-[0.1px] sm:border-b-[0.25px] my-4"/>
                        <div className="flex flex-col gap-3">
                            <div className="form-control w-full">
                                <div data-tip=".jpg .png .svg .gif .webp" className='tooltip tooltip-bottom flex flex-col items-center'>
                                    <label htmlFor="fileUpload" className='cursor-pointer border rounded-xl border-opacity-60 w-1/3 aspect-square bg-base-300 flex flex-col text-justify justify-center'>
                                        {
                                            selectedImage ?
                                            <Image className='w-full h-full rounded-xl' src={selectedImage} width={100} height={100} alt="Selected image" />
                                            :
                                            <span className='mr-2 text-xs text-center md:text-lg font-bold'>Chose a cover image</span>
                                        }
                                        <input onChange={handleImageChange} accept="image/png, image/jpg, image/svg, image/gif, image/webp" id="fileUpload" type="file" placeholder='Chose a cover image' className="hidden"/>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="w-full flex flex-col gap-2 items-center">
                                <input type='text' placeholder='Give a title!' className='input w-10/12 font-bold' onChange={(e) => setTitle(e.target.value)}/>
                                <div className='border-b-[0.1px] sm:border-b-[0.25px] my-2 border-opacity-5 w-10/12'></div>
                                {
                                    Array.from({length: promptList.length}, (_, index) => {
                                        return (
                                            <input onChange={(e) => setPromptList(prev => {prev[index] = e.target.value; return prev})} type="text" placeholder={`Prompt ${index+1}..`} key={index} className="input w-10/12" />
                                        )
                                    })
                                }
                                <button onClick={()=>{if(promptList.length<=19){setPromptList(prev => incrimentArr(prev))}}} className='btn bg-base-100 border border-primary border-opacity-30 w-10/12 mt-2'>Add Prompt</button>
                                <button onClick={()=>{if(promptList.length>6){setPromptList(prev => decrimentArr(prev))}}} className='btn bg-base-100 border border-primary border-opacity-30 w-10/12'>Remove Prompt</button>
                            </div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='flex justify-between items-end gap-2 w-10/12'>
                                <label htmlFor="CreatePack" className="btn btn-accent mt-4 w-5/12">Close</label>
                                <button className='btn btn-primary text-accent font-bold w-5/12' onClick={async () => await submitPack(userModel, title, promptList, setError)}>Create Pack</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );

}