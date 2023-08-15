'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import {Admin, Record, RecordAuthResponse} from 'pocketbase';
import Link from 'next/link';
import Image from 'next/image';
import Pocketbase from 'pocketbase';
import { Users } from '@/global/types/Users';
import ProfileStats from './ProfileStats';
import { FaGear } from 'react-icons/fa6'
import { useAppDispatch, useAppSelector } from '@/global/hooks/reduxHooks';
import { setAuth } from '@/global/store/authSlice';
import { selectAuth } from '@/global/store/authSlice';



export default function DashboardHeader({
}:{ 
}
){
    const [error, setError] = useState<Error | undefined>(undefined);
    const [userModel, setUserModel] = useState<Users | Admin | null>(null);
    const [signInData, setSignInData] = useState({
        email: "",
        pass: ""
    })
    const dispatch = useAppDispatch();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = event.target;
        setSignInData((prev)=> ({...prev, [name]: value}))
    }

    function SignOut(){
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        pb.authStore.clear();
        dispatch(setAuth({isAuth: false}))
        setUserModel(null);   
    }

    async function SignIn(signInData: {email: string, pass: string}){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
        if(!emailRegex.test(signInData.email)){
            const emailError = new Error;
            emailError.name = "emailNotValid"
            emailError.message = "Please enter a valid email address"
            return setError(emailError);
        }
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        await pb.collection('users').authWithPassword<Users>(signInData.email.toLowerCase(), signInData.pass)
        .then((rec: RecordAuthResponse<Users>)=>{
            pb.authStore.save(rec.token, rec.record);
            dispatch(setAuth({isAuth: true}))
            setUserModel(pb.authStore.model as Users);
        })
        .catch((e)=>{
            console.log("Failed to login");
            const emailError = new Error;
            emailError.name = "loginFailed"
            emailError.message = "Login failed. Please check email/pass."
            return setError(emailError);
        });
    }
    

    useEffect(()=>{
        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        setUserModel(pb.authStore.model as Users);
        
        return () => {
            setError(undefined);
        }
    },[]);

    return (
        <div className="flex w-full items-center">
            {userModel != null ?
                <div className="flex gap-4 w-full">
                    <div className="avatar w-20 md:w-24 rounded-xl">
                        {userModel.avatar !== "" ? 
                        <Image className='rounded-xl aspect-square overflow-clip w-full h-full' src={`${process.env.POCKETBASE_URL}/api/files/users/${userModel.id}/${userModel.avatar}`} width={200} height={200} alt="profile" priority={true}/>
                        :
                        <Image className='bg-primary p-1 rounded-xl aspect-square' src="/DefaultProfile.png" width={80} height={80} alt="alt image" priority={true}/>    
                        }
                    </div>
                    <ProfileStats userModel={userModel}/>
                    <label htmlFor='settings' className='btn-sm sm:btn bg-base-300 border-primary border-opacity-60 rounded-xl flex items-center align-middle justify-center'>
                        <FaGear/>
                    </label>
                    <input type='checkbox' id="settings" className='modal-toggle'/>
                    <label htmlFor='settings' className='modal cursor-pointer'>
                        <label className='modal-box bg-base-300 border border-primary border-opacity-25'>
                            <h3 className='text-xl sm:text-2xl font-bold'>Settings</h3>
                            <div className="border-b my-4"/>
                            <button className='btn btn-accent' onClick={()=>SignOut()}>Sign Out</button>
                        </label>
                    </label>
                </div>
                :
                <>
                    <label htmlFor="signIn" className=" ml-auto justify-self-end btn btn-accent min-h-[2.5rem] h-2">Sign in</label>
                    <input type="checkbox" id="signIn" className="modal-toggle"/>
                    <label htmlFor="signIn" className="modal cursor-pointer">
                        <label className="modal-box relative bg-base-300 border border-primary border-opacity-25" htmlFor="">
                            <h3 className="text-2xl font-bold">Log In</h3>
                            <div className="border-b my-4"/>
                            <div className="flex flex-col gap-2 my-4">
                                <input type="text" name="email" onChange={handleInputChange} placeholder="E-mail" className="p-2 rounded-lg font-semibold text-lg"/>
                                <input type="password" name="pass" onChange={handleInputChange} placeholder="Password" className="p-2 rounded-lg font-semibold text-lg"/>
                            </div>
                            <div className="text-center text-primary underline underline-offset-2 font-semibold">Forgot your password?</div>
                            <div className="flex flex-col mt-4 items-center">
                                {
                                    error && (error.name==="emailNotValid" || error.name==="loginFailed") &&
                                    
                                    <div className='bg-warning rounded-lg font-bold p-1 text-center mb-2 w-full tracking-wide'>
                                        {error?.message}
                                    </div>
                                }
                                <button onClick={()=>SignIn(signInData)} className="w-full btn btn-accent text-xl font-bold text-primary tracking-wide">Login</button>
                                <div className="border-b border-primary my-4 w-full"/>
                                <Link href="/SignUp" className="text-center text-primary underline underline-offset-2 font-semibold">Don&apos;t have an account? Sign-Up</Link>
                            </div>
                        </label>
                    </label>
                </>
                }
        </div>
    );
}