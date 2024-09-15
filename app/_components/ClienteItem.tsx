import { Cliente } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"

interface ClienteItemProps {
  cliente: Cliente
}

const ClienteItem = ({ cliente }: ClienteItemProps) => {
  return (
    <Card className="w-[200px] rounded-2xl">
      <CardContent className="p-0 px-1 pt-1">
        <div className="relative h-[100px] w-full">
          <Image
            src="/avatar.png"
            alt="Avatar do usuário"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <div className="px-2 pb-3">
          <h3 className="truncate font-semibold">{cliente.nome}</h3>
          <p className="text-sm text-gray-400">{cliente.email}</p>
          <p className="text-sm text-gray-400">{cliente.telefone}</p>
          <Button variant="secondary" className="mt-3 w-full">
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClienteItem
