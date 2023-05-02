'use client';
import { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

export default function SpotifySearch({
    isActive
}:{
    isActive: boolean,
}
){
    const [search, setSearch] = useState<string>('');

    return (
        <div className="p-4 rounded-md border border-primary border-opacity-100 bg-base-300 w-full md:w-1/2 lg:w-1/3">
            {/* Search */}
            <div className='flex gap-2 items-center m-0 border-b pb-2'>
                <input type='text' placeholder='Search...' className='rounded-lg px-2 py-2 text-xl lg:py-3 w-full font-extrabold lg:text-2xl'/>
                <button className='btn btn-ghost p-1'>
                    <IoSearch size={32}/>
                </button>
            </div>
            {/* Results */}
            <div className='pt-2'>
                Artist list
            </div>
        </div>
    );

}