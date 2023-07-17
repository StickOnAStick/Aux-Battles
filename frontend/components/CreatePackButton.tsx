'use client'
import { Users } from '@/global/types/Users';
import { Admin } from 'pocketbase';
import { FaPlus } from 'react-icons/fa'

export default function CreatePackButton({
    userModel
}:{
    userModel: Users | Admin | null;
}){
    
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
                                <label className="label">
                                    <span className="label-text">Pick an Image</span>
                                    <span className="label-text-alt">.png/.jpg/.gif/.webp</span>
                                </label>
                                <input type="file" className="file-input file-input-bordered w-full"/>
                            </div>
                            <div className="">

                            </div>
                        </div>
                        <div>
                            <label htmlFor="CreatePack" className="btn btn-accent mt-4">Close</label>
                        </div>
                    </div>
                </div>
            </div>
    );

}