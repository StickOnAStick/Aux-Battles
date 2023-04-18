import Image from "next/image";
import { Admin, Record } from "pocketbase";
import SignIn from "./SignIn";

export default function DashboardHeader({
    userModel
}: {
    userModel: Record | Admin | null
}) {
    return (
        <div className="rounded-lg w-full sm:w-10/12 md:w-2/3 mt-1 py-2">
            <div className="flex gap-3">
                {userModel && 
                <div className="avatar">
                    <div className="w-10 md:w-24 rounded-xl">
                        <Image src="/user-icon-png-free-2-2940122909" width={100} height={100} alt="profile" />
                    </div>
                </div>
                }
                

                <div className="flex flex-col gap-4 xs:flex-row xs:justify-between justify-center w-full border border-primary rounded border-opacity-10 py-2 px-2">
                    <SignIn/>
                    <div className="flex flex-col justify-center xs:justify-start w-full xs:w-1/2">
                        <h2 className="font-bold text-xl">And Gain Access To: </h2>
                        <ul className="ml-20 text-xl tracking-tight">
                            <li>Your Spotify Libraries</li>
                            <li>Game Stats</li>
                            <li>And More custom packs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}