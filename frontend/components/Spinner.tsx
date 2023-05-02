'use client';
import { useState, useEffect} from 'react';


export default function SpinnerWrapper({
    children
}:{
    children: React.ReactNode
}){         
    

    return (
        <div id="spinner" className='flex justify-center items-center'>

            This is the spinner
        </div>
    );
}