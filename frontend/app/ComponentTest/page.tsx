
export default function ComponentTest (

){
    return(
        <div className="min-h-screen flex justify-center  items-center">
            {/* @ts-expect-error */}
            <div className="radial-progress animate-spin" style={{ "--value": "33", "--size": "1.25rem", "--thickness": "0.115rem"}}></div>
        </div>
    )
}