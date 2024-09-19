import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { marca, modelo, ano, placa, cliente } = await req.json()
    console.log("Dados recebidos:", { marca, modelo, ano, placa, cliente })

    const newCarro = await prisma.carro.create({
      data: {
        marca,
        modelo,
        ano: parseInt(ano),
        placa,
        cliente: {
          connect: {
            id: parseInt(cliente),
          },
        },
      },
    })
    console.log("Carro criado:", newCarro)

    return NextResponse.json(newCarro, { status: 200 })
  } catch (error) {
    console.error("Erro ao criar carro:", error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("Placa duplicada")
      return NextResponse.json(
        {
          error:
            "A placa já cadastrada. Confira novamente se os dados estão corretos.",
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 501 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, marca, modelo, ano, placa, cliente } = await req.json()
    console.log("Dados recebidos para atualização:", {
      id,
      marca,
      modelo,
      ano,
      placa,
      cliente,
    })

    const updatedCarro = await prisma.carro.update({
      where: { id: parseInt(id) },
      data: {
        marca,
        modelo,
        ano: parseInt(ano),
        placa,
        cliente: {
          connect: {
            id: parseInt(cliente),
          },
        },
      },
    })
    console.log("Carro atualizado:", updatedCarro)

    return NextResponse.json(updatedCarro, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar carro:", error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("Placa duplicada")
      return NextResponse.json(
        {
          error:
            "A placa já cadastrada. Confira novamente se os dados estão corretos.",
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
      searchParams.get("placa") === null ||
      searchParams.get("placa") === ""
    ) {
      const carros = await prisma.carro.findMany({
        include: {
          cliente: true,
        },
      })
      return NextResponse.json(carros, { status: 200 })
    }
    const placa = searchParams.get("placa") || ""
    const carros = await prisma.carro.findMany({
      where: {
        placa: {
          contains: (placa as string) || "",
          mode: "insensitive",
        },
      },
      include: {
        cliente: true,
      },
    })
    return NextResponse.json(carros, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar carros" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    console.log("ID do carro a ser excluído:", id)

    const deletedCarro = await prisma.carro.delete({
      where: { id: parseInt(id) },
    })
    console.log("Carro excluído:", deletedCarro)

    return NextResponse.json(deletedCarro, { status: 200 })
  } catch (error) {
    console.error("Erro ao excluir carro:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
