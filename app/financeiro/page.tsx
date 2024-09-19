import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table"

const FinanceiroPage: React.FC = () => {
  const orcamentosPendentesAprovados = [
    { id: 1, descricao: "Orçamento 1", status: "Pendente" },
    { id: 2, descricao: "Orçamento 2", status: "Aprovado" },
  ]

  const orcamentosPagos = [{ id: 1, descricao: "Orçamento 3", status: "Pago" }]

  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ marginBottom: "20px" }}>
        <CardHeader>
          <CardTitle>Valor a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <p>R$ 10.000,00</p>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <CardHeader>
          <CardTitle>Orçamentos Pendentes e Aprovados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentosPendentesAprovados.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell>{orcamento.id}</TableCell>
                  <TableCell>{orcamento.descricao}</TableCell>
                  <TableCell>{orcamento.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orçamentos Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentosPagos.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell>{orcamento.id}</TableCell>
                  <TableCell>{orcamento.descricao}</TableCell>
                  <TableCell>{orcamento.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinanceiroPage
