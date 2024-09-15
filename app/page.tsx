import { SearchIcon } from "lucide-react"
import Header from "./_components/Header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"
import { db } from "./_lib/prisma"
import UsuarioItem from "./_components/UsuariosItem"

const Home = async () => {
  const usuarios = await db.usuario.findMany({})
  // console.log({ usuarios })
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

        <div className="relative mt-8 h-[150px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase">Clientes</h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {usuarios
            .filter((usuario) => usuario.tipo_usuario === "cliente")
            .map((usuario) => (
              <UsuarioItem key={usuario.id} usuario={usuario} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Home
