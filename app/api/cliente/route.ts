import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, email, telefone, endereco } = await req.json()
    console.log("Dados recebidos:", { nome, cpf, email, telefone, endereco })

    const newCliente = await prisma.cliente.create({
      data: {
        nome,
        cpf,
        email,
        telefone,
        endereco,
        senha: "123456",
      },
    })
    console.log("Cliente criado:", newCliente)

    return NextResponse.json(newCliente, { status: 200 })
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("Email duplicado")
      return NextResponse.json(
        { error: "O email já está em uso. Por favor, use outro email." },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: error }, { status: 501 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    // console.log("Parâmetros de busca:", searchParams)
    // console.log(searchParams.get("nome"))
    if (searchParams.get("nome") === null || searchParams.get("nome") === "") {
      // console.log("Buscando todos os clientes")
      const clientes = await prisma.cliente.findMany({})
      // console.log("Clientes encontrados:", clientes)
      return NextResponse.json(clientes, { status: 200 })
    }
    const nome = searchParams.get("nome") || ""
    const clientes = await prisma.cliente.findMany({
      where: {
        nome: {
          contains: (nome as string) || "",
          mode: "insensitive",
        },
      },
    })
    return NextResponse.json(clientes, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    console.log("ID do cliente a ser excluído:", id)

    const deletedCliente = await prisma.cliente.delete({
      where: { id: parseInt(id) },
    })
    console.log("Cliente excluído:", deletedCliente)

    return NextResponse.json(deletedCliente, { status: 200 })
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
