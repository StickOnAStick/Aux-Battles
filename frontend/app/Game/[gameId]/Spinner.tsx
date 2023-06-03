export default function Spinner({
  prompts,
  selected
}:{
  prompts: string[],
  selected: number  
}){
   
    return (
        
        <button className="flex w-full text-6xl font-extrabold justify-center items-center h-full">
            Spinner
            <br/>
            {prompts}
            <br/>
            {selected}
        </button>
    );
}