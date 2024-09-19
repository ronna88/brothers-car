import { Card, CardContent } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { notFound } from "next/navigation"
import {
  CircleCheck,
  CircleDollarSign,
  CircleFadingArrowUp,
  CircleX,
  PencilIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import CarroForm from "@/app/_components/CarroForm"

interface CarroPageProps {
  params: {
    id: number
  }
}

interface Carro {
  id: number
  marca: string
  modelo: string
  ano: number
  placa: string
  cliente: {
    id: number
    nome: string
    cpf: string | null
    email: string | null
    telefone: string | null
    endereco: string | null
  }
  orcamentos: {
    id: number
    descricao: string | null
    valor_total: number
    status: "pendente" | "aprovado" | "pago" | "cancelado"
  }[]
}

const CarroDetalhes = async ({ params }: CarroPageProps) => {
  const carroDetails = await db.carro.findUnique({
    where: {
      id: parseInt(params.id + ""),
    },
    include: {
      orcamentos: true,
      cliente: true,
    },
  })

  if (!carroDetails) {
    return notFound()
  }

  const carro: Carro = carroDetails

  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-2">
      <Card className="flex w-3/4 justify-self-center">
        <CardContent className="w-11/12 p-3">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-500">
            Detalhes do Carro
          </h2>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Marca:</h3>
            <p className="text-gray-500">{carro.marca}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Modelo:</h3>
            <p className="text-gray-500">{carro.modelo}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Ano:</h3>
            <p className="text-gray-500">{carro.ano}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Placa:</h3>
            <p className="text-gray-500">{carro.placa}</p>
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="mt-2 flex flex-row gap-1 rounded-lg bg-slate-600 px-1 py-1">
                <PencilIcon size={20} />
                Editar
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar dados do Carro</DialogTitle>
                <DialogDescription>
                  Atualização dos dados cadastrais do carro.
                </DialogDescription>
              </DialogHeader>
              <CarroForm carro={carro} id={params.id} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
            Detalhes do Cliente
          </h2>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Nome:</h3>
            <p className="text-gray-500">{carro.cliente.nome}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Email:</h3>
            <p className="text-gray-500">{carro.cliente.email}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Telefone:</h3>
            <p className="text-gray-500">{carro.cliente.telefone}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Endereço:</h3>
            <p className="text-gray-500">{carro.cliente.endereco}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <div>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Orçamentos
            </h2>
            <div>
              {carro?.orcamentos.map((orcamento) => (
                <div key={orcamento.id}>
                  <div className="flex flex-row justify-between gap-2">
                    <div>{orcamento.descricao}</div>
                    <div>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(orcamento.valor_total)}
                    </div>
                    <div>
                      {orcamento.status === "pendente" && (
                        <CircleFadingArrowUp
                          size={20}
                          className="text-yellow-300"
                        />
                      )}
                      {orcamento.status === "aprovado" && (
                        <CircleCheck size={20} className="text-blue-500" />
                      )}
                      {orcamento.status === "pago" && (
                        <CircleDollarSign
                          size={20}
                          className="text-green-500"
                        />
                      )}{" "}
                      {orcamento.status === "cancelado" && (
                        <CircleX size={20} className="text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <h2 className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
            Legenda
          </h2>
          <div className="grid grid-cols-2">
            <div>
              <CircleFadingArrowUp size={20} className="text-yellow-300" />
            </div>
            <div className="text-gray-500">Pendente</div>
            <div>
              <CircleCheck size={20} className="text-blue-500" />
            </div>
            <div className="text-gray-500">Aprovado</div>
            <div>
              <CircleDollarSign size={20} className="text-green-500" />
            </div>
            <div className="text-gray-500">Pago</div>
            <div>
              <CircleX size={20} className="text-red-600" />
            </div>
            <div className="text-gray-500">Cancelado</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CarroDetalhes
