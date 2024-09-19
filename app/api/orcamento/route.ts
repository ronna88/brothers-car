import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

interface ItemOrcamento {
  descricao: string
  quantidade: string
  valor: string
}

export async function POST(req: NextRequest) {
  try {
    const { cliente, carro, descricao, items, valor_total } = await req.json()
    console.log("Dados recebidos:", {
      cliente,
      carro,
      descricao,
      items,
      valor_total,
    })

    const newOrcamento = await prisma.orcamento.create({
      data: {
        cliente: {
          connect: {
            id: parseInt(cliente),
          },
        },
        carro: {
          connect: {
            id: parseInt(carro),
          },
        },
        valor_total: parseFloat(valor_total),
        status: "pendente",
        descricao: descricao,
        itens: {
          create: items.map((item: ItemOrcamento) => ({
            descricao: item.descricao,
            quantidade: parseInt(item.quantidade),
            valor: parseFloat(item.valor),
          })),
        },
      },
    })
    console.log("Orçamento criado:", newOrcamento)

    return NextResponse.json(newOrcamento, { status: 200 })
  } catch (error) {
    console.error("Erro ao criar orçamento:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, cliente, carro, descricao, valor_total, itens } =
      await req.json()
    console.log("Dados recebidos para atualização:", {
      id,
      cliente,
      carro,
      descricao,
      valor_total,
      itens,
    })

    const updatedOrcamento = await prisma.orcamento.update({
      where: { id: parseInt(id) },
      data: {
        cliente: {
          connect: {
            id: parseInt(cliente),
          },
        },
        carro: {
          connect: {
            id: parseInt(carro),
          },
        },
        descricao,
        valor_total: parseFloat(valor_total),
        itens: {
          deleteMany: {}, // Remove os itens antigos
          create: itens.map((item: ItemOrcamento) => ({
            descricao: item.descricao,
            quantidade: parseInt(item.quantidade),
            valor: parseFloat(item.valor),
          })),
        },
      },
    })
    console.log("Orçamento atualizado:", updatedOrcamento)

    return NextResponse.json(updatedOrcamento, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar orçamento:", error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("duplicado...")
      return NextResponse.json(
        {
          error: "Confira novamente se os dados estão corretos.",
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    if (
      searchParams.get("cliente") === null ||
      searchParams.get("cliente") === ""
    ) {
      const orcamentos = await prisma.orcamento.findMany({
        include: {
          cliente: true,
          carro: true,
        },
      })
      return NextResponse.json(orcamentos, { status: 200 })
    }
    const clienteNome = searchParams.get("cliente") || ""
    const orcamentos = await prisma.orcamento.findMany({
      where: {
        cliente: {
          nome: {
            contains: clienteNome,
            mode: "insensitive",
          },
        },
      },
      include: {
        cliente: true,
        carro: true,
      },
    })
    return NextResponse.json(orcamentos, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar orçamentos" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    console.log("ID do orçamento a ser excluído:", id)

    // Excluir os itens relacionados ao orçamento
    await prisma.itemOrcamento.deleteMany({
      where: { orcamento_id: parseInt(id) },
    })
    console.log("Itens do orçamento excluídos")

    // Excluir o orçamento
    const deletedOrcamento = await prisma.orcamento.delete({
      where: { id: parseInt(id) },
    })
    console.log("Orçamento excluído:", deletedOrcamento)

    return NextResponse.json(deletedOrcamento, { status: 200 })
  } catch (error) {
    console.error("Erro ao excluir orçamento:", error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir o orçamento devido a restrições de chave estrangeira.",
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
