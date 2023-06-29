import Link from "next/link";

export default function GameSelect(){
    return (
        <div className="min-h-screen bg-opacity-90">
            <Link href="/" className=" rounded-lg bg-warning p-2 ml-2 mt-[-0.5rem] z-30 absolute">Back</Link>
            <div className="hero min-h-screen top-0 absolute z-0 text-white">
                <li className="list-none flex flex-col sm:flex-row  justify-center gap-3 md:gap-5 lg:gap-7 text-white hero-content min-h-full min-w-full">
                    
                    <Link href="/Local" className="btn btn-lg bg-base-200 hover:bg-accent hover:text-primary rounded-xl w-10/12 xs:w-6/12 sm:w-3/12 p-2 border-2 hover:shadow-lg hover:shadow-base-300 hover:border-opacity-10 border-primary-content hover:border-accent-content font-bold tracking-wide
                     transition-all md:hover:-translate-y-1 ease-in-out delay-75 focus:translate-y-1">
                        Local
                    </Link>
                    <div className="tooltip btn btn-lg bg-base-200 hover:bg-accent hover:text-primary rounded-xl w-10/12 xs:w-6/12 sm:w-3/12 p-2 border-2 hover:shadow-lg hover:shadow-base-300 hover:border-opacity-10 border-primary-content hover:border-accent-content font-bold tracking-wide
                            transition-all md:hover:-translate-y-1 ease-in-out delay-75 focus:translate-y-1" data-tip="Coming soon!">
                        <div className="flex flex-col justify-center h-[100%]">
                            Online
                        </div>
                    </div>
                </li>
            </div>
        </div>
    );
}