'use client';
import { Record, Admin } from "pocketbase"
import { FaPlus, FaList } from 'react-icons/fa'
import Pocketbase from 'pocketbase';
import { useState, useEffect } from "react";
import { Users } from "@/global/types/Users";
import { Packs } from "@/global/types/Packs";
import { ListResult } from "@/global/types/ListResult";
import PackCard from "@/components/PackCard";
import CreatePackButton from "@/components/CreatePackButton";

function handleCreatePack(userModel: Users | Admin | null){

}

async function getPackData(page: number, setMaxPage: React.Dispatch<React.SetStateAction<number>>): Promise<Packs[] | undefined> {
    const pb = new Pocketbase(process.env.POCKETBASE_URL);
    const packData: ListResult<Packs>  = await pb.collection('packs').getList(page, 8)
    setMaxPage(packData.totalPages);
    if(!packData) return undefined;
    const packs: Packs[]  = packData.items;
    
    return packs;
}

export default function DashboardMarket(){

    const [userModel, setUserModel] = useState<Users | Admin | null>(null);
    const [packData, setPackData] = useState<Packs[] | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(0);
    
    useEffect(()=>{
        const fetchData = async () =>{
            const data = await getPackData(page, setMaxPage);
            setPackData(data);
        }
        fetchData();
    },[page])

    useEffect(()=>{
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        setUserModel(pb.authStore.model as Users);
        const cancelSub = pb.authStore.onChange(()=>{
            console.log("Hit callback inside market")
            setUserModel(pb.authStore.model as Users | Admin | null);
        })
        return () => cancelSub();
    },[]);
    

    return (
        <>
        User Auth: {userModel?.id}
        <div className="flex gap-3 justify-between h-12">
            
            <CreatePackButton userModel={userModel}/>

            <input type="text" placeholder="Search Packs" className=" placeholder:text-primary placeholder:text-opacity-40 input input-bordered bg-base-300 border-primary-content relative w-8/12 md:w-10/12 min-h-full h-full"/>
            
            <div className="tooltip tooltip-bottom min-h-full h-full w-2/12 md:w-1/12" data-tip="Filter">
                <button className="btn border border-primary-content bg-base-300 min-h-full h-full w-full text-primary"><FaList/></button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {packData?.map((pack: Packs) => {
                return (
                    <PackCard pack={pack} userModel={userModel} key={pack.id}/>
                );
            })}
        </div>
        <div className="join w-full flex justify-center my-4 ">
            <button onClick={()=>{if(page>1) setPage(page-1)}} className="join-item btn bg-base-300 border-none">«</button>
            <span className="join-item bg-base-300 border-none align-bottom flex flex-col justify-center">Page {page}</span>
            <button onClick={()=> {if(page<maxPage)setPage(prevPage => prevPage + 1)}} className="join-item btn bg-base-300 border-none">»</button>
        </div>
        </>
    );
}