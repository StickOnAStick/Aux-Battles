import Link from 'next/link';
import HostGame from './HostGame';
import JoinGame from './JoinGame';
import { cookies } from 'next/headers';

export default async function LocalLobby(){

    const cookieStore = cookies();
    const token = cookieStore.get('token');
    

    return (
        <div className="min-h-screen">
            <Link href="/Play" className=" rounded-lg bg-warning p-2 m-2">Back</Link>
            <div className='hero min-h-screen'>
                <div className="hero-content text-center text-primary flex flex-col gap-5">
                    <JoinGame localToken={token?.value}/>
                    <HostGame localToken={token?.value}/>
                </div>
            </div>
        </div>
    );
}