'use client'
import { Users } from '@/global/types/Users';
import { Admin } from 'pocketbase';
import { FaPlus } from 'react-icons/fa'
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import Pocketbase from 'pocketbase';
import { PackData, Packs, PacksPayload } from '@/global/types/Packs';
import LoadingSpinner from './LoadingSpinner';


async function submitPack(
    userModel: Users | Admin | null, 
    title: string, 
    prompts: string[], 
    image: File | null,  
    description: string,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    closeModalRef: React.RefObject<HTMLLabelElement>,
    setSuccess: React.Dispatch<React.SetStateAction<string | null>>
    ){
    if(!userModel){
        const error = new Error;
        error.name = "NotSigned";
        error.message = "Sign In to create pack"
        setError(error);
        return;
    }
    if(!image){
        const error = new Error;
        error.name = "image";
        error.message = "Add an image to your pack!"
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

    
    console.log(image)
    prompts = prompts.filter(prompt => prompt.trim() !== '');
    if(prompts.length < 6) {
        const error = new Error;
        error.name = "empty";
        error.message = "Enter prompts to create pack"
        setError(error);
        return;
    }
    let formData: FormData = new FormData();
    //data -- Annoying method for uploading images
    formData.append("image", image);
    formData.append("name", title);
    formData.append('desc', description);
    formData.append("price", '2.99');
    formData.append('rating', '0');
    formData.append('packData', JSON.stringify({prompts: prompts}));
    formData.append('creator', userModel.id);
    const pb = new Pocketbase(process.env.POCKETBASE_URL);
    const data: PacksPayload = {
        name: title,
        desc: description,
        price: 2.99,
        rating: 0,
        packData: {prompts: prompts},
        creator: userModel.id,
    }

    const pack = await pb.collection('packs').create(formData)
    .catch(e => setError(new Error("Failed to create pack", {cause: "packCreation"})))
    // await pb.collection('packs').update(pack.id, formData)
    // .catch((e) => console.log("Error uploading image: ", e));
    setLoading(false);
    setSuccess("Pack Created!");
    setTimeout(()=>{
        setSuccess(null);
        closeModalRef.current?.click();
    },800)
}


export default function CreatePackButton({
    userModel
}:{
    userModel: Users | Admin | null;
}){
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>('');
    const [promptList, setPromptList] = useState<string[]>(new Array<string>(6));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);

    const closeModalRef = useRef<HTMLLabelElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]
        if(!file){
            setSelectedImage(null);
            setImageFile(null);
            return;
        } 
        setImageFile(file);
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
                                <div className='flex flex-col gap-3 w-full items-center'>
                                    <input type='text' placeholder='Give a title!' maxLength={40} className='input w-10/12 font-bold' onChange={(e) => setTitle(e.target.value)}/>
                                    <textarea 
                                        placeholder='Description' 
                                        maxLength={140} 
                                        className='input w-10/12 font-bold h-24 py-2' 
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        >
                                    </textarea>
                                </div>
                                <div className='border-b-[0.1px] sm:border-b-[0.25px] my-2 border-opacity-5 w-10/12'></div>
                                {
                                    Array.from({length: promptList.length}, (_, index) => {
                                        return (
                                            <input maxLength={40} onChange={(e) => setPromptList(prev => {prev[index] = e.target.value; console.log("prev: ", prev, "\nValue: ", e.target.value); return prev})} type="text" placeholder={`Prompt ${index+1}..`} key={index} className="input w-10/12" />
                                        )
                                    })
                                }
                                <button onClick={()=>{if(promptList.length<=19){setPromptList(prev => incrimentArr(prev))}}} className='btn bg-base-100 border border-primary border-opacity-30 w-10/12 mt-2'>Add Prompt</button>
                                <button onClick={()=>{if(promptList.length>6){setPromptList(prev => decrimentArr(prev))}}} className='btn bg-base-100 border border-primary border-opacity-30 w-10/12'>Remove Prompt</button>
                                {
                                    error && 
                                    <div className='bg-warning rounded-lg py-2 w-10/12 font-bold tracking-wide'>
                                        {error.message}
                                    </div>
                                }
                                {
                                success &&
                                <div className='rounded-lg bg-success p-2 w-10/12 font-bold tracking-wide text-base-300'>
                                    {success}
                                </div>
                                }
                            </div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='flex justify-between items-end gap-2 w-10/12'>
                                <label ref={closeModalRef} htmlFor="CreatePack" className="btn btn-accent mt-4 w-5/12">Close</label>
                                
                                <button className='btn btn-primary text-accent font-bold w-5/12' onClick={async () => {setLoading(true); await submitPack(userModel, title, promptList, imageFile, description, setError, setLoading, closeModalRef, setSuccess)}}>
                                    {loading ?
                                    <LoadingSpinner/>
                                    :
                                    <>Create Pack</>                             
                                    }
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
    );

}