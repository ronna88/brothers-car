"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table"
import { EyeIcon, TrashIcon } from "lucide-react"
import { Button } from "../_components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
}

interface ClientesTableProps {
  clientes: Cliente[]
}

const ClientesTable = ({ clientes }: ClientesTableProps) => {
  const [clientList, setClientList] = useState(clientes)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cliente`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Erro ao excluir cliente")
      }

      setClientList(clientList.filter((cliente) => cliente.id !== parseInt(id)))
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
    }
  }

  useEffect(() => {
    console.log(clientes)
    if (clientes !== clientList) {
      setClientList(clientes)
    }
  }, [clientes])

  return (
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
        {clientList.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell>{cliente.nome}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>{cliente.telefone}</TableCell>
            <TableCell>{cliente.endereco}</TableCell>
            <TableCell>
              <Button variant="outline">
                <Link href={`/clientes/${cliente.id}`}>
                  <EyeIcon className="text-blue-500" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete("" + cliente.id)}
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

export default ClientesTable
