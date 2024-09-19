"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"

const formSchema = z.object({
  id: z.number().optional(),
  cliente: z.string().nonempty("Selecione um cliente"),
  carro: z.string().nonempty("Selecione um carro"),
  descricao: z.string().nonempty("Descrição é obrigatória"),
  itens: z.array(
    z.object({
      descricao: z.string().nonempty("Descrição é obrigatória"),
      quantidade: z.string().min(1, "Quantidade mínima é 1"),
      valor: z.string(),
    }),
  ),
  valor_total: z.any().optional(),
})

interface OrcamentoFormProps {
  id?: number
  orcamento?: {
    id: number
    descricao: string | null
    cliente: {
      id: number
      nome: string
      cpf: string | null
      email: string | null
      telefone: string | null
      endereco: string | null
    }
    carro: {
      id: number
      modelo: string
      marca: string
      placa: string
    }
    itens: {
      id: number
      descricao: string | null
      quantidade: number
      valor: number
    }[]
  }
}

const OrcamentoForm: React.FC<OrcamentoFormProps> = ({ orcamento }) => {
  const router = useRouter()
  const [filteredCarros, setFilteredCarros] = useState<
    { id: string; modelo: string; cliente_id: number }[]
  >([])
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([])
  const [carros, setCarros] = useState<
    { id: string; modelo: string; cliente_id: number }[]
  >([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: orcamento
      ? {
          cliente: orcamento.cliente.id.toString(),
          carro: orcamento.carro.id.toString(),
          descricao: orcamento.descricao || "",
          itens: orcamento.itens
            ? orcamento.itens.map((item) => ({
                descricao: item.descricao || "",
                quantidade: item.quantidade.toString(),
                valor: item.valor.toString(),
              }))
            : [{ descricao: "", quantidade: "1", valor: "0" }],
        }
      : {
          cliente: "",
          carro: "",
          descricao: "",
          itens: [{ descricao: "", quantidade: "1", valor: "0" }],
        },
  })

  useEffect(() => {
    // console.log(orcamento)
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

    const fetchCarros = async () => {
      try {
        const response = await fetch("/api/carro")
        if (response.ok) {
          const data = await response.json()
          setCarros(data)
        } else {
          toast.error("Erro ao buscar carros")
        }
      } catch (error) {
        toast.error("Erro ao buscar carros")
      }
    }

    fetchClientes()
    fetchCarros()
  }, [])

  useEffect(() => {
    if (orcamento) {
      form.setValue("cliente", orcamento.cliente.id.toString())
      form.setValue("carro", orcamento.carro.id.toString())
    }
  }, [orcamento, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  })

  useEffect(() => {
    if (form.watch("cliente")) {
      setFilteredCarros(
        carros.filter(
          (carro) => carro.cliente_id === parseInt(form.watch("cliente")),
        ),
      )
    }
  }, [form.watch("cliente"), carros])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    data = { ...data, id: orcamento ? Number(orcamento.id) : undefined }
    id: orcamento ? orcamento.id : undefined
    console.log("data", data)
    let valorTotal = 0.0
    for (let i = 0; i < data.itens.length; i++) {
      valorTotal += parseFloat(data.itens[i].valor.replace(",", "."))
    }
    data = {
      ...data,
      itens: data.itens.map((item) => ({
        ...item,
        valor: parseFloat(item.valor.replace(",", ".")).toString(),
      })),
    }
    data = { ...data, valor_total: valorTotal }

    try {
      const response = await fetch("/api/orcamento", {
        method: orcamento ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await response.json()
        toast.success(
          `Orçamento ${orcamento ? "atualizado" : "criado"} com sucesso`,
        )
        router.push("/orcamentos")
      } else {
        const errorData = await response.json()
        toast.error(
          errorData.error ||
            `Erro ao ${orcamento ? "atualizar" : "criar"} orçamento`,
        )
        console.error(
          `Erro ao ${orcamento ? "atualizar" : "criar"} orçamento:`,
          errorData,
        )
        router.push("/orcamentos")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(
        `Erro ao ${orcamento ? "atualizar" : "criar"} orçamento: ${errorMessage}`,
      )
      console.error(
        `Erro ao ${orcamento ? "atualizar" : "criar"} orçamento:`,
        error,
      )
      router.push("/orcamentos")
    }
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent>
            <FormField
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={String(cliente.id)}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="carro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carro</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!filteredCarros.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o carro" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCarros.map((carro) => (
                        <SelectItem key={carro.id} value={String(carro.id)}>
                          {carro.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do orçamento</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Descrição do orçamento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3>Peças e Serviços</h3>
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-4 gap-2">
                <FormField
                  name={`itens.${index}.descricao`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`itens.${index}.quantidade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Quantidade"
                          {...field}
                          onChange={(e) => {
                            const regex = /^[0-9.,]*$/
                            if (regex.test(e.target.value)) {
                              field.onChange(e.target.value.toString())
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`itens.${index}.valor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Valor"
                          {...field}
                          onChange={(e) => {
                            const regex = /^[0-9.,]*$/
                            if (regex.test(e.target.value)) {
                              field.onChange(e.target.value)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={() => remove(index)}>
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({ descricao: "", quantidade: "1", valor: "0" })
              }
            >
              Adicionar Item
            </Button>
          </CardContent>
        </Card>
        <Button type="submit">
          {orcamento ? "Atualizar Orçamento" : "Criar Orçamento"}
        </Button>
      </form>
    </Form>
  )
}

export default OrcamentoForm
