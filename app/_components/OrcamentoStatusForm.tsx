"use client"

import { useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"

const formSchema = z.object({
  status: z.string().nonempty("Status é obrigatório"),
})

interface OrcamentoFormProps {
  orcamento?: {
    id: string
    status: string
  }
}

const OrcamentoStatusForm: React.FC<OrcamentoFormProps> = ({ orcamento }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: orcamento
      ? {
          status: orcamento.status,
        }
      : {
          status: "",
        },
  })

  useEffect(() => {
    console.log(orcamento)
  }, [orcamento])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("data", data)
    try {
      const response = await fetch(`/api/orcamento/${orcamento?.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await response.json()
        toast.success("Status do orçamento atualizado com sucesso")
        router.push("/orcamentos")
      } else {
        const errorData = await response.json()
        toast.error(
          errorData.error || "Erro ao atualizar o status do orçamento",
        )
        console.error("Erro ao atualizar o status do orçamento:", errorData)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(`Erro ao atualizar o status do orçamento: ${errorMessage}`)
      console.error("Erro ao atualizar o status do orçamento:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent>
            <FormField
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o novo status do orçamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}

export default OrcamentoStatusForm
