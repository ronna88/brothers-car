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
import { EyeIcon, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Carro {
  id: number
  cliente_id: number
  marca: string
  modelo: string
  ano: number
  placa: string
  data_registro: string
  cliente: {
    nome: string
    cpf: string
    email: string
    telefone: string
    endereco: string
    id: number
  }
}

interface CarrosTableProps {
  carros: Carro[]
}

const CarrosTable = ({ carros }: CarrosTableProps) => {
  const [carroList, setCarroList] = useState(carros)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/carro`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Erro ao excluir carro")
      }
      setCarroList(carroList.filter((carro) => carro.id !== parseInt(id)))
      toast.success("Carro excluído com sucesso")
      router.push("/carros")
      window.location.reload()
    } catch (error) {
      toast.error("Erro ao excluir carro")
      console.error("Erro ao excluir carro:", error)
      window.location.reload()
    }
  }

  useEffect(() => {
    if (carros.length > carroList.length) {
      if (carros !== carroList) {
        setCarroList(carros)
      }
    }
  }, [carros, carroList])

  return (
    <Table>
      <TableCaption>Lista de carros cadastrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Marca</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carroList.map((carro) => (
          <TableRow key={carro.id}>
            <TableCell>{carro.marca}</TableCell>
            <TableCell>{carro.modelo}</TableCell>
            <TableCell>{carro.ano}</TableCell>
            <TableCell>{carro.placa}</TableCell>
            <TableCell>
              <Link href={`/clientes/${carro.cliente.id}`}>
                {carro.cliente.nome}
              </Link>
            </TableCell>
            <TableCell>
              <Button variant="outline">
                <Link href={`/carros/${carro.id}`}>
                  <EyeIcon className="text-blue-500" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete("" + carro.id)}
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

export default CarrosTable
