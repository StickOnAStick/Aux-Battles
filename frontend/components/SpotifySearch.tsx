'use client';
import { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

export default function SpotifySearch(
    {
        userSpotId,
    }:{
        userSpotId?: string,
    }
){
    const [search, setSearch] = useState<string>('');


    return (
        <div className="p-3 rounded-md border border-primary border-opacity-50 bg-base-300 w-full md:w-1/2 lg:w-1/3">
            {/* Search */}
            <div className='flex gap-2 items-center m-0 border-b pb-2'>
                <IoSearch size={16}/>
                <input type='text' placeholder='Search...' className='rounded-lg px-2 py-1 w-full'></input>
            </div>
            {/* Results */}
            <div className='pt-2'>
                Artist list
            </div>
        </div>
    );

}