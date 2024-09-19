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
import OrcamentoForm from "@/app/_components/OrcamentoForm"
import OrcamentoStatusForm from "@/app/_components/OrcamentoStatusForm"

interface OrcamentoPageProps {
  params: {
    id: string
  }
}

const OrcamentoDetalhes = async ({ params }: OrcamentoPageProps) => {
  const orcamento = await db.orcamento.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      carro: true,
      cliente: true,
      itens: true,
    },
  })

  if (!orcamento) {
    return notFound()
  }

  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-2">
      <Card className="flex w-3/4 justify-self-center">
        <CardContent className="w-11/12 p-3">
          <h2 className="mb-3 text-xs font-bold uppercase text-gray-500">
            Detalhes do Orçamento
          </h2>
          <div className="px-20">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Data:</h3>
              <p className="text-gray-500">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(orcamento.data_criacao))}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Descrição:</h3>
              <p className="text-gray-500">{orcamento.descricao}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Carro:</h3>
              <p className="text-gray-500">
                {`${orcamento.carro.modelo} - ${orcamento.carro.placa}`}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Itens:</h3>
              <ul>
                {orcamento.itens.map((item) => (
                  <li key={item.id}>
                    <div className="flex flex-row gap-2">
                      <p className="text-gray-500">{item.descricao}</p>
                      <p className="text-gray-500">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.valor)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Valor Total:</h3>
              <p className="text-gray-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(orcamento.valor_total)}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Status:</h3>
              <div>
                {orcamento.status === "pendente" && (
                  <div className="flex flex-row gap-1">
                    <CircleFadingArrowUp
                      size={20}
                      className="text-yellow-300"
                    />
                    {orcamento.status}
                  </div>
                )}
                {orcamento.status === "aprovado" && (
                  <div className="flex flex-row gap-1">
                    <CircleCheck size={20} className="text-blue-500" />
                    {orcamento.status}
                  </div>
                )}
                {orcamento.status === "pago" && (
                  <div className="flex flex-row gap-1">
                    <CircleDollarSign size={20} className="text-green-500" />
                    {orcamento.status}
                  </div>
                )}
                {orcamento.status === "cancelado" && (
                  <div className="flex flex-row gap-1">
                    <CircleX size={20} className="text-red-600" />
                    {orcamento.status}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="mx-20 mt-2 flex flex-row gap-1 rounded-lg bg-slate-600 px-2 py-1">
                <PencilIcon size={20} />
                Editar
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar dados do Orçamento</DialogTitle>
                <DialogDescription>Atualização do orçamento.</DialogDescription>
              </DialogHeader>
              <OrcamentoForm orcamento={orcamento} id={params.id} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <div className="mx-20 mt-2 flex flex-row gap-1 rounded-lg bg-slate-600 px-2 py-1">
                <PencilIcon size={20} />
                Alterar Status
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mudança de status do Orçamento</DialogTitle>
                <DialogDescription>Atualização do orçamento.</DialogDescription>
              </DialogHeader>
              <OrcamentoStatusForm orcamento={orcamento} id={params.id} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
            Detalhes do Cliente
          </h2>
          <div className="px-20">
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Nome:</h3>
              <p className="text-gray-500">{orcamento.cliente.nome}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Email:</h3>
              <p className="text-gray-500">{orcamento.cliente.email}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Telefone:</h3>
              <p className="text-gray-500">{orcamento.cliente.telefone}</p>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="font-semibold">Endereço:</h3>
              <p className="text-gray-500">{orcamento.cliente.endereco}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex w-3/4 justify-self-center">
        <CardContent>
          <h2 className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
            Legenda
          </h2>
          <div className="mx-20 grid grid-cols-2">
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

export default OrcamentoDetalhes
