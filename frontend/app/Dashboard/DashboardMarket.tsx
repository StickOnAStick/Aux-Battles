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
import { useAppSelector } from "@/global/hooks/reduxHooks";

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

async function searchPacks(search: string): Promise<Packs[]> {
    const pb = new Pocketbase(process.env.POCKETBASE_URL);
    const results = new Array<Packs>();
    while(results.length < 16){
        for(let i = 3; i < search.length; i++){
            const query = search.substring(0,i);
            await pb.collection('packs').getList(1,10,{
                filter: `name <= ${query}`
            })
            .then((res) => {
                res.items.map((pack) => {
                    results.push(pack as Packs);
                })
            })
            .catch((e)=>{console.log("No results found")})
        }
    }
    return results;
}

export default function DashboardMarket(){

    const [userModel, setUserModel] = useState<Users | Admin | null>(null);
    const [packData, setPackData] = useState<Packs[] | undefined>(undefined);
    const [query, setQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(0);
    const authState = useAppSelector(authState => authState.auth.isAuth);
    
    useEffect(()=>{
        const fetchData = async () =>{
            const data = await getPackData(page, setMaxPage);
            setPackData(data);
        }
        fetchData();
    },[page])

    useEffect(()=>{
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        const user = pb.authStore.model;
        setUserModel(user as Users | null);
    },[authState]);
    
    return (
        <>
        <div className="flex gap-3 justify-between h-12">
            
            <CreatePackButton userModel={userModel}/>

            <input type="text" onChange={(e)=> {setQuery(e.target.value)}} onSubmit={async ()=>{setPackData(await searchPacks(query))}} placeholder="Search Packs" className=" placeholder:text-primary placeholder:text-opacity-40 input input-bordered bg-base-300 border-primary-content relative w-8/12 md:w-10/12 min-h-full h-full"/>
            
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
            <button onClick={()=>{if(page>1) setPage(page-1)}} className="join-item btn bg-base-200 border-none">«</button>
            <span className="join-item border-none align-bottom flex flex-col justify-center px-2">Page {page}</span>
            <button onClick={()=> {if(page<maxPage)setPage(prevPage => prevPage + 1)}} className="join-item btn bg-base-200 border-none">»</button>
        </div>
        </>
    );
}