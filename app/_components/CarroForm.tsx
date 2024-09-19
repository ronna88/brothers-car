"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const formSchema = z.object({
  marca: z.string().trim().min(1),
  modelo: z.string().trim().min(1),
  ano: z.string().trim().min(4),
  placa: z.string().trim().min(1),
  cliente: z.string().trim().min(1),
})

interface CarroFormProps {
  id?: number
  carro?: {
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
  }
}

const CarroForm: React.FC<CarroFormProps> = ({ carro }) => {
  const router = useRouter()
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marca: carro?.marca || "",
      modelo: carro?.modelo || "",
      ano: carro?.ano.toString() || "",
      placa: carro?.placa || "",
      cliente: carro?.cliente?.id.toString() || "", // Certifique-se de que o valor inicial do cliente seja uma string
    },
  })

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("/api/cliente")
        if (response.ok) {
          const data = await response.json()
          setClientes(data)
        } else {
          toast.error("Erro ao buscar clientes")
        }
      } catch (error) {
        toast.error("Erro ao buscar clientes")
      }
    }

    fetchClientes()
  }, [])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/carro", {
        method: carro ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carro ? { id: carro.id, ...data } : data),
      })
      if (response.ok) {
        await response.json()
        toast.success(`Carro ${carro ? "atualizado" : "criado"} com sucesso`)
        router.push("/carros")
      } else {
        const errorData = await response.json()
        toast.error(
          errorData.error || `Erro ao ${carro ? "atualizar" : "criar"} carro`,
        )
        console.error(
          `Erro ao ${carro ? "atualizar" : "criar"} carro:`,
          errorData,
        )
        router.push("/carros")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(
        `Erro ao ${carro ? "atualizar" : "criar"} carro: ${errorMessage}`,
      )
      console.error(`Erro ao ${carro ? "atualizar" : "criar"} carro:`, error)
      router.push("/carros")
    }
  }

  return (
    <div className="flex w-full justify-center">
      <Card className="w-11/12">
        <CardContent className="m-0 flex justify-center p-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col items-center gap-2"
            >
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Marca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Placa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // Certifique-se de que o valor do campo seja usado
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">
                            Selecione um cliente
                          </SelectItem>
                          {clientes.map((cliente) => (
                            <SelectItem
                              key={cliente.id}
                              value={cliente.id.toString()}
                            >
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-6">
                Salvar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CarroForm
