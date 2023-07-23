export default function DashboardContainer({
    children
}:{
    children: React.ReactNode
}
){
    return(
        <div className='bg-base-200 flex-1 border-t-2 border-primary border-opacity-60 md:border-x-2 rounded-t-xl w-full md:w-9/12 px-6 py-4'>
            {children}
        </div>
    )
}