'use client';
import { useState } from 'react';

export default function SignIn(){

    const [signInData, setSignInData] = useState({
        email: "",
        pass: ""
    })

    return (
        <>
            <label htmlFor="signIn" className="w-full sm:w-2/3 z-50 btn btn-primary text-accent sm:h-full font-bold tracking-wider text-2xl sm:text-5xl">
                Sign in
            </label>

            <input type="checkbox" id="signIn" className="modal-toggle"/>
            <label htmlFor="signIn" className="modal cursor-pointer">
                <label className="modal-box relative bg-base-300 border border-primary border-opacity-25" htmlFor="">
                    <h3 className="text-2xl font-bold">Log In</h3>
                    <div className="border-b my-4"/>
                    <div className="flex flex-col gap-2 my-4">
                        <input type="text" placeholder="E-mail" className="p-2 rounded-lg font-semibold text-lg"/>
                        <input type="password" placeholder="Password" className="p-2 rounded-lg font-semibold text-lg"/>
                    </div>
                    <div className="text-center text-primary underline underline-offset-2 font-semibold">Forgot your password?</div>
                    <div className="flex flex-col mt-4 items-center">
                        <button className="w-full btn btn-accent text-xl font-bold text-primary tracking-wide">Login</button>
                        <div className="border-b border-primary my-4 w-full"/>
                        <a className="text-center text-primary underline underline-offset-2 font-semibold">Don&apos;t have an account? Sign-Up</a>
                    </div>
                </label>
            </label>
        </>
    )
}