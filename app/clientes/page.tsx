import { PenLineIcon, SearchIcon, TrashIcon } from "lucide-react"
import Header from "../_components/Header"
import { Button } from "../_components/ui/button"
import { Input } from "../_components/ui/input"
import Image from "next/image"
import { db } from "../_lib/prisma"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table"

const Home = async () => {
  const clientes = await db.cliente.findMany({})
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
          <Table>
            <TableCaption>Lista de clientes cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.endereco}</TableCell>
                  <TableCell>
                    <Button variant="outline">
                      <PenLineIcon />
                    </Button>
                    <Button variant="outline">
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Home
