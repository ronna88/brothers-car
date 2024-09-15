import { Usuario } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"

interface UsuarioItemProps {
  usuario: Usuario
}

const UsuarioItem = ({ usuario }: UsuarioItemProps) => {
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
          <h3 className="truncate font-semibold">{usuario.nome}</h3>
          <p className="text-sm text-gray-400">{usuario.telefone}</p>
          <Button variant="secondary" className="mt-3 w-full">
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default UsuarioItem
