import DashBoardSwitch from "@/components/DashboardSwitch"
import Link from "next/link"

export default function Home() {

  return (
    <main >
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content text-center text-primary">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Aux Battles <span className=" text-base bg-warning p-2 rounded-lg align-middle tracking-wide">BETA</span></h1>
            <Link href="/Play" className="btn btn-accent font-bold text-xl text-primary animate-bounce">Play</Link>
          </div>
        </div>
        {/* <DashBoardSwitch className="absolute bottom-[2rem]"/> */}
      </div>
    </main>
  )
}
