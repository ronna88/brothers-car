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
import ClienteForm from "@/app/_components/ClienteForm"

interface ClientePageProps {
  params: {
    id: number
  }
}

interface Cliente {
  id: number
  nome: string
  email: string | null
  cpf: string | null
  telefone: string | null
  endereco: string | null
  orcamentos?: {
    id: number
    descricao: string | null
    valor_total: number
    status: string
  }[]
}

const ClienteDetalhes = async ({ params }: ClientePageProps) => {
  const clienteDetails = await db.cliente.findUnique({
    where: {
      id: parseInt(params.id + ""),
    },
    include: {
      orcamentos: true,
    },
  })

  if (!clienteDetails) {
    return notFound()
  }

  const cliente: Cliente = clienteDetails

  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-2">
      <Card className="flex w-3/4 justify-self-center">
        <CardContent className="w-11/12 p-3">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-500">
            Detalhes do Cliente
          </h2>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Nome:</h3>
            <h3 className="font-semibold">{cliente?.nome}</h3>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Email:</h3>
            <p className="text-gray-500">{cliente?.email}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Email:</h3>
            <p className="text-gray-500">{cliente?.telefone}</p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold">Endereço:</h3>
            <p className="text-gray-500">{cliente?.endereco}</p>
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
                <DialogTitle>Editar dados do Cliente</DialogTitle>
                <DialogDescription>
                  Atualização dos dados cadastrais do cliente.
                </DialogDescription>
              </DialogHeader>
              <ClienteForm cliente={cliente} id={params.id} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <div>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
              Orçamentos
            </h2>
            <div>
              {cliente?.orcamentos?.map((orcamento) => (
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

export default ClienteDetalhes
