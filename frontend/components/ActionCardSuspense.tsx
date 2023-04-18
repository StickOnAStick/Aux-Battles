export default function ActionCardSuspense ({
    isGame
}:{
    isGame: boolean,
}) { 
    return (
        <li className={ "flex justify-between bg-base-200"  + (isGame ? " rounded-lg border border-primary border-opacity-10 lg:w-80 " : " ")}>
            Loading...
        </li>
    )
}