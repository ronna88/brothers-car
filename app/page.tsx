import { SearchIcon } from "lucide-react"
import Header from "./_components/Header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"

const Home = () => {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl">Olá, Theo</h2>
        <p>Segunda-Feira, 05 de agosto</p>
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Buscar clientes..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-8 h-[240px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
