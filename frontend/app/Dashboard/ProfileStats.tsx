import { Users } from "@/global/types/Users";
import { Admin } from "pocketbase";

export default function ProfileStats({
    userModel
}:{
    userModel: Users | Admin | null
}){
    return(
        <div className="flex justify-between w-full gap-5">
            <div className="text-xs sm:text-lg flex flex-col justify-between w-1/3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-wide">{userModel?.username}</h2>
                {/* <p >Games played: {userModel?.games}</p>
                <p>Games won: {userModel?.won}</p> */}
            </div>
            {/* <div className="text-xs sm:text-lg flex flex-col justify-around w-2/3">
                <p>Top Artist: {userModel?.topArtist}</p>
                <p>Top Genre: {userModel?.topGenre}</p>
            </div> */}
        </div>
    )
}