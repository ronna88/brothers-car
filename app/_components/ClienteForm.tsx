"use client"

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

const formSchema = z.object({
  nome: z.string().trim().min(1),
  cpf: z.string().trim().min(11),
  email: z.string(),
  telefone: z.string(),
  endereco: z.string(),
})

interface ClienteFormProps {
  id?: number
  cliente?: {
    id?: number
    nome: string
    cpf: string | null
    email: string | null
    telefone: string | null
    endereco: string | null
    orcamentos?: {
      id: number
      descricao: string | null
      valor_total: number
      status: string
    }[]
  }
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente }) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: cliente
      ? {
          ...cliente,
          cpf: cliente.cpf ?? "",
          email: cliente.email ?? "",
          telefone: cliente.telefone ?? "",
          endereco: cliente.endereco ?? "",
        }
      : {
          nome: "",
          cpf: "",
          email: "",
          telefone: "",
          endereco: "",
        },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // event.preventDefault()
    try {
      const response = await fetch("/api/cliente", {
        method: cliente ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente ? { id: cliente.id, ...data } : data),
      })
      if (response.ok) {
        await response.json()
        toast.success(
          `Cliente ${cliente ? "atualizado" : "criado"} com sucesso`,
        )
        router.push("/clientes")
      } else {
        const errorData = await response.json()
        toast.error(
          errorData.error ||
            `Erro ao ${cliente ? "atualizar" : "criar"} cliente`,
        )
        console.error(
          `Erro ao ${cliente ? "atualizar" : "criar"} cliente:`,
          errorData,
        )
        router.push("/clientes")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(
        `Erro ao ${cliente ? "atualizar" : "criar"} cliente: ${errorMessage}`,
      )
      console.error(
        `Erro ao ${cliente ? "atualizar" : "criar"} cliente:`,
        error,
      )
      router.push("/clientes")
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
                name="nome"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="CPF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem className="w-11/12">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço" {...field} />
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

export default ClienteForm
