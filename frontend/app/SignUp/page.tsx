'use client';
import {useState, ChangeEvent} from 'react'
import Link from 'next/link';
import Pocketbase from 'pocketbase'
import { useRouter } from 'next/navigation';
import Image from 'next/image'

interface signInData {
    user: string,
    email: string,
    pass: string,
    confirmPass: string
}

export default function SignUp(){

    const router = useRouter();

    const [error, setError] = useState<Error | undefined>(undefined);
    const [verificationModal, setVerfificationModal] = useState<boolean>(false);
    const [verificationCode, setVerfificationCode] = useState<string>("");
    const [singInData, setSignInData] = useState<signInData>({
        user: '',
        email: "",
        pass: "",
        confirmPass: ''
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = event.target;
        setSignInData((prev)=> ({...prev, [name]: value}))
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]
        if(!file){
            setSelectedImage(null);
            setImageFile(null);
            return;
        } 
        setImageFile(file);
        const reader = new FileReader();

        reader.onloadend = () => setSelectedImage(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function Register(cred: signInData){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
        if(!emailRegex.test(cred.email)){
            const emailError = new Error;
            emailError.name = "Email"
            emailError.message = "Please enter a valid email address"
            return setError(emailError);
        }
        if(cred.pass !== cred.confirmPass){
            const passError = new Error;
            passError.name = 'Pass';
            passError.message = "Passwords do not match";
        }
        if(cred.pass.length < 8) {
            const passError = new Error;
            passError.name = 'Pass';
            passError.message = "Passwords must be 8 or more characters";
            return setError(passError);
        }
        if(!imageFile){
            const passError = new Error;
            passError.name = 'record';
            passError.message = "Chose a profile picture";
            return setError(passError);
        }

        const pb = new Pocketbase(process.env.POCKETBASE_URL);
        const data = {
            username: cred.user,
            email: cred.email.toLowerCase(),
            password: cred.pass,
            passwordConfirm: cred.confirmPass,
            packs: ["w4oudqe45it58g9"],
        }

        let formData = new FormData();
        formData.append('username', cred.user);
        formData.append('email', cred.email.toLowerCase());
        formData.append('password', cred.pass);
        formData.append('passwordConfirm', cred.confirmPass);
        formData.append('packs', "81lq23qhz63z0w0");
        formData.append('avatar', imageFile)
        
        const record = await pb.collection('users').create(formData)
        .then(async()=>{
            //Mail verification for mid-Aug update
            // await pb.collection('users').requestVerification(cred.email);
            // setVerfificationModal(true);
            await pb.collection('users').authWithPassword(cred.email, cred.pass)
            .then((e)=>{
                pb.authStore.save(e.token, e.record);
                const model = pb.authStore.model;
                const isValid = pb.authStore.isValid;
                console.log("model: " + model, "\nisValid: " + isValid, "\nPB model: ", pb.authStore.model, "\nPB token: ", pb.authStore.token);
                router.push('/Dashboard');
            })
            .catch((e)=>{
                console.log("Could sign in user")
                router.push("/Dashboard")
            })
            
        }).catch((e) => {
            console.log(e);
            const creationError = new Error;
            creationError.name = 'record';
            creationError.message = "Email or username already taken. Please change your username or sign in."
            setError(creationError);
        });   
    }

    return (
        <>
        <Link href="/" className=" rounded-lg bg-warning p-2 ml-2 mt-[-0.5rem] z-30 absolute">Back</Link>
        <div className="w-full flex flex-col justify-center h-full items-center px-4">
            {verificationModal &&
            
            <div className='absolute flex justify-center items-center w-screen h-screen bg-base-300 bg-opacity-40 '>
                <div className='bg-base-300 border border-primary rounded-xl p-6 border-opacity-25 flex flex-col items-center'>
                    <h3 className='text-2xl font-bold text-center'>Enter your verification code</h3>
                    <div className='border-t border-primary w-full my-4'/>
                    <input onChange={(e)=>{setVerfificationCode(e.target.value)}} type='text' className='w-full p-2 rounded-lg font-semibold text-lg text-center' placeholder='1234-1234'/>
                    
                    <div className='flex gap-2 justify-between w-full mt-4'>
                        <button className='btn btn-accent' type='submit'>Submit</button>
                        <button className='btn btn-primary text-accent' type='button' onClick={()=>{setVerfificationModal(false); console.log("Cancel verification")}}>Cancel</button>    
                    </div>
                    
                </div>
                
            </div>
            }
            <label className="w-full sm:w-2/3 lg:w-1/3 xl:w-1/5 bg-base-300 border border-primary border-opacity-25 p-6 rounded-2xl" >
                <h3 className="text-2xl font-bold">Sign Up</h3>
                <div className="border-b my-4"/>
                <div className="flex flex-col gap-2 my-4">
                    {error && error.name === "record" &&
                        <div className='bg-warning rounded-lg font-bold p-1 text-center'>{error.message}</div>
                    }
                    {error && error.name === "Email" &&
                        <div className='bg-warning rounded-lg font-bold p-1 text-center'>{error.message}</div>
                    }
                    {error && error.name === "Pass" &&
                        <div className='bg-warning rounded-lg font-bold p-1 text-center'>{error.message}</div>
                    }
                    <div className="form-control w-full">
                        <div data-tip=".jpg .png .svg .gif .webp" className='tooltip tooltip-bottom flex flex-col items-center'>
                            <label htmlFor="fileUpload" className='cursor-pointer border rounded-xl border-opacity-60 w-1/3 aspect-square bg-base-300 flex flex-col text-justify justify-center'>
                                {
                                    selectedImage ?
                                    <Image className='w-full h-full rounded-xl' src={selectedImage} width={100} height={100} alt="Selected image" />
                                    :
                                    <span className='mr-2 text-xs text-center md:text-sm font-bold'>Chose a cover image</span>
                                }
                                <input onChange={handleImageChange} accept="image/png, image/jpg, image/svg, image/gif, image/webp" id="fileUpload" type="file" placeholder='Chose a cover image' className="hidden"/>
                            </label>
                        </div>
                    </div>
                    <input type="text" name="user" onChange={handleInputChange} placeholder="Username" className={" p-2 rounded-lg font-semibold text-lg "}/>
                    <input type="text" name="email" onChange={handleInputChange} placeholder="E-mail" className="p-2 rounded-lg font-semibold text-lg"/>
                    <input type="password" name="pass" onChange={handleInputChange} placeholder="Password" className="p-2 rounded-lg font-semibold text-lg"/>
                    <input type="password" name="confirmPass" onChange={handleInputChange} placeholder="Confirm Password" className={"p-2 rounded-lg font-semibold text-lg" + (singInData.pass !== singInData.confirmPass ? " border border-warning " : " ")}/>
                </div>
                <div className="flex flex-col mt-4 items-center">
                    <button onClick={()=>Register(singInData)} className="w-full btn btn-accent text-xl font-bold text-primary tracking-wide">Create Account</button>
                </div>
            </label>
        </div>
        
        </>
    )
}