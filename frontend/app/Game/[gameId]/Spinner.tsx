'use client';
import { useState, useEffect} from 'react';


export default function SpinnerWrapper({
    children
}:{
    children: React.ReactNode
}){         
    if(typeof window !== 'undefined'){
        //console.log(document.getElementById('spinner')?.getBoundingClientRect());
    }
    const spinning = false;

    return (
        <div id="spinner" className='w-full h-full flex justify-center items-center'>

            {
                !spinning && 
                <div className='absolute top-20 w-full flex justify-center'>
                    {children}
                </div>
            }

            This is the spinner
        </div>
    );
}