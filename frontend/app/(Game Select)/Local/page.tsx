import Link from 'next/link';
import HostGame from './HostGame';
import JoinGame from './JoinGame';
import { pb } from '@/app/api/pocketbase';
import PocketBase from 'pocketbase';

export default async function LocalLobby(){

    const pb = new PocketBase('http://http://localhost:8091')

    

    try{
        const cookie = await fetch('http://localhost:3000/api/Local');
        if(cookie.ok){
            console.log(cookie);
        }else{
            console.log("warning")
        }
    }catch (e){
        console.log(e)
    }
    console.log(pb.authStore.loadFromCookie('token'));

    return (
        <div className="min-h-screen">
            <Link href="/Play" className=" rounded-lg bg-warning p-2 m-2">Back</Link>
            <div className='hero min-h-screen'>
                <div className="hero-content text-center text-primary flex flex-col gap-5">
                    <JoinGame/>
                    <HostGame/>
                </div>
            </div>
        </div>
    );
}