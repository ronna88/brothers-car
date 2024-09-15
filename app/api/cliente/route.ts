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
  const userAgent = req.headers.get("user-agent") || "Unknown"
  console.debug(userAgent)
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
}
