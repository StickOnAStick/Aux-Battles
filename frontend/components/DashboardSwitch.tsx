'use client';
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image';

import { useState, useEffect } from 'react';


const DashBoardSwitch = ({className }: {className?: string}) => {
    
    const router = useRouter();
    const [path, setPath] = useState<string>(usePathname())

    function handleRoutes(){
        path == "/" ? 
          router.replace("/dashboard")
          : router.replace("/");
    }

    return (
        <button type="button" onClick={()=> handleRoutes()} className={className + " btn bg-base-200 text-primary semi-bold text-xl hover:bg-accent border-primary border-opacity-50" + (path == "/" ? " " : " border-t-0 ")}>
                {path == "/" ? "DashBoard" : "Play" }
        </button>
    );
}

export default DashBoardSwitch;