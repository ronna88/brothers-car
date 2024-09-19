import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const { status } = await request.json()

  if (!status) {
    return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 })
  }

  try {
    const updatedOrcamento = await prisma.orcamento.update({
      where: { id: parseInt(id) },
      data: { status },
    })

    return NextResponse.json(updatedOrcamento)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Erro ao atualizar o status do orçamento" },
      { status: 500 },
    )
  }
}
