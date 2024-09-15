import { PrismaClient, TipoUsuario, Status } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // Criação de usuários administrativos
  await prisma.usuario.create({
    data: {
      nome: "Admin",
      email: "admin@example.com",
      senha: "senha123",
      tipo_usuario: TipoUsuario.administrativo, // Tipo de usuário como administrativo
    },
  })

  // Criação de clientes com carros
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: "João Silva",
      email: "joao.silva@example.com",
      senha: "senha123",
      cpf: "123.456.789-01",
      telefone: "(11) 98765-4321",
      endereco: "Rua A, 123",
      carros: {
        create: [
          { marca: "Toyota", modelo: "Corolla", ano: 2015, placa: "ABC-1234" },
          { marca: "Honda", modelo: "Civic", ano: 2018, placa: "XYZ-5678" },
        ],
      },
    },
  })

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      senha: "senha123",
      cpf: "234.567.890-12",
      telefone: "(11) 99876-5432",
      endereco: "Rua B, 456",
      carros: {
        create: [
          { marca: "Ford", modelo: "Fiesta", ano: 2014, placa: "KLM-9876" },
        ],
      },
    },
  })

  // Recuperar os carros dos clientes
  const carro1 = await prisma.carro.findFirst({ where: { placa: "ABC-1234" } })
  const carro2 = await prisma.carro.findFirst({ where: { placa: "XYZ-5678" } })
  const carro3 = await prisma.carro.findFirst({ where: { placa: "KLM-9876" } })

  // Criação de orçamentos com relacionamento ao carro e cliente
  await prisma.orcamento.create({
    data: {
      cliente_id: cliente1.id,
      carro_id: carro1.id, // Relacionando ao carro correto
      valor_total: 1200.5,
      status: Status.pendente,
      descricao: "Troca de óleo e filtros",
    },
  })

  await prisma.orcamento.create({
    data: {
      cliente_id: cliente1.id,
      carro_id: carro2.id, // Relacionando ao carro correto
      valor_total: 850.0,
      status: Status.aprovado,
      descricao: "Manutenção nos freios",
    },
  })

  await prisma.orcamento.create({
    data: {
      cliente_id: cliente2.id,
      carro_id: carro3.id, // Relacionando ao carro correto
      valor_total: 2000.0,
      status: Status.pago,
      descricao: "Revisão geral",
    },
  })

  // Criação de pagamentos para os orçamentos
  await prisma.pagamento.createMany({
    data: [
      {
        orcamento_id: 1,
        valor_pago: 1200.5,
        metodo_pagamento: "Cartão de Crédito",
      },
      { orcamento_id: 2, valor_pago: 850.0, metodo_pagamento: "Dinheiro" },
      {
        orcamento_id: 3,
        valor_pago: 2000.0,
        metodo_pagamento: "Transferência Bancária",
      },
    ],
  })

  console.log("Seed data created!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
