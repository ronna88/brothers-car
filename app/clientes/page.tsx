import { SearchIcon, UserPlus } from "lucide-react"
import { Button } from "../_components/ui/button"
import { Input } from "../_components/ui/input"
import Image from "next/image"
import { db } from "../_lib/prisma"
import Link from "next/link"
import ClientesTable from "../_components/ClienteTable"

const Home = async () => {
  const clientes = await db.cliente.findMany({})

  return (
    <div>
      <div className="p-5">
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Buscar clientes..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-8 h-[150px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase">Clientes</h2>
        <div className="flex flex-col gap-4 overflow-auto">
          <div>
            <Button>
              <Link href={`clientes/form`} className="flex flex-row gap-2">
                <UserPlus size={20} />
                <span> Adicionar Cliente</span>
              </Link>
            </Button>
          </div>
          <ClientesTable clientes={clientes} />
        </div>
      </div>
    </div>
  )
}

export default Home
