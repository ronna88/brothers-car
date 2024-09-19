"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  CircleCheck,
  CircleDollarSign,
  CircleFadingArrowUp,
  CircleX,
} from "lucide-react"
import { EyeIcon, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Orcamento {
  id: number
  data_criacao: string
  cliente: {
    nome: string
  }
  carro: {
    modelo: string
    placa: string
  }
  valor_total: number
  status: "pendente" | "aprovado" | "pago" | "cancelado"
}

interface OrcamentosTableProps {
  orcamentos: Orcamento[]
}

const OrcamentosTable = ({ orcamentos }: OrcamentosTableProps) => {
  const [orcamentoList, setOrcamentoList] = useState(orcamentos)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/orcamento`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        toast.error("Erro ao excluir orçamento")
        throw new Error("Erro ao excluir orçamento")
      }

      setOrcamentoList(
        orcamentoList.filter(
          (orcamento: { id: number }) => orcamento.id !== parseInt(id),
        ),
      )
      toast.success("Orçamento excluído com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir orçamento")
      console.error("Erro ao excluir orçamento:", error)
    }
  }

  useEffect(() => {
    // console.log(orcamentos)
    if (orcamentos !== orcamentoList) {
      setOrcamentoList(orcamentos)
    }
  }, [orcamentos])

  return (
    <Table>
      <TableCaption>Lista de orçamentos cadastrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Carro - Placa</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orcamentoList.map((orcamento) => (
          <TableRow key={orcamento.id}>
            <TableCell>
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeZone: "America/Sao_Paulo",
              }).format(new Date(orcamento.data_criacao))}
            </TableCell>
            <TableCell>{orcamento.cliente.nome}</TableCell>
            <TableCell>{`${orcamento.carro.modelo} - ${orcamento.carro.placa}`}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(orcamento.valor_total)}
            </TableCell>
            <TableCell>
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
                    <CircleX size={20} className="text-red-600" />{" "}
                    {orcamento.status}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Button variant="outline">
                <Link href={`/orcamentos/${orcamento.id}`}>
                  <EyeIcon className="text-blue-500" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete("" + orcamento.id)}
              >
                <TrashIcon className="text-red-600" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default OrcamentosTable
