const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Criação de usuários (clientes e administrativos)
  const cliente1 = await prisma.usuario.create({
    data: {
      nome: "João da Silva",
      email: "joao.silva@example.com",
      senha: "senha123",
      tipo_usuario: "cliente",
      telefone: "11999999999",
      endereco: "Rua A, 123",
      carros: {
        create: [
          { marca: "Toyota", modelo: "Corolla", ano: 2020, placa: "ABC-1234" },
          { marca: "Honda", modelo: "Civic", ano: 2018, placa: "DEF-5678" },
        ],
      },
    },
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      nome: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      senha: "senha456",
      tipo_usuario: "cliente",
      telefone: "21988888888",
      endereco: "Rua B, 456",
      carros: {
        create: [
          { marca: "Ford", modelo: "Fiesta", ano: 2019, placa: "GHI-9012" },
        ],
      },
    },
  });

  const cliente3 = await prisma.usuario.create({
    data: {
      nome: "Carlos Pereira",
      email: "carlos.pereira@example.com",
      senha: "senha789",
      tipo_usuario: "cliente",
      telefone: "31977777777",
      endereco: "Rua C, 789",
      carros: {
        create: [
          { marca: "Chevrolet", modelo: "Onix", ano: 2021, placa: "JKL-3456" },
          { marca: "Volkswagen", modelo: "Gol", ano: 2017, placa: "MNO-7890" },
        ],
      },
    },
  });

  // Usuário administrativo
  const admin = await prisma.usuario.create({
    data: {
      nome: "Admin Oficina",
      email: "admin@oficina.com",
      senha: "admin123",
      tipo_usuario: "administrativo",
      telefone: "11988888888",
      endereco: "Avenida Central, 1000",
    },
  });

  // Criação de orçamentos com diferentes status
  const orcamento1 = await prisma.orcamento.create({
    data: {
      cliente_id: cliente1.id,
      carro_id: 1, // Primeiro carro do cliente1 (Corolla)
      valor_total: 1500.5,
      status: "pendente",
      descricao: "Troca de pneus e revisão geral",
    },
  });

  const orcamento2 = await prisma.orcamento.create({
    data: {
      cliente_id: cliente1.id,
      carro_id: 2, // Segundo carro do cliente1 (Civic)
      valor_total: 2000.0,
      status: "aprovado",
      descricao: "Troca de óleo e alinhamento",
    },
  });

  const orcamento3 = await prisma.orcamento.create({
    data: {
      cliente_id: cliente2.id,
      carro_id: 3, // Carro do cliente2 (Fiesta)
      valor_total: 800.0,
      status: "pago",
      descricao: "Substituição de pastilhas de freio",
    },
  });

  const orcamento4 = await prisma.orcamento.create({
    data: {
      cliente_id: cliente3.id,
      carro_id: 4, // Primeiro carro do cliente3 (Onix)
      valor_total: 1800.0,
      status: "cancelado",
      descricao: "Reparo no sistema de suspensão",
    },
  });

  // Criação de pagamentos (somente para orçamentos com status "pago")
  await prisma.pagamento.create({
    data: {
      orcamento_id: orcamento3.id, // Pagamento para o orçamento do cliente2 (Fiesta)
      valor_pago: 800.0,
      metodo_pagamento: "Cartão de Crédito",
      observacao: "Pagamento realizado em 2x",
    },
  });

  // Adicionando mais carros para o cliente1
  const carrosExtras = [
    { marca: "Renault", modelo: "Sandero", ano: 2020, placa: "STU-5678" },
    { marca: "Nissan", modelo: "Versa", ano: 2019, placa: "VWX-9012" },
    { marca: "Hyundai", modelo: "HB20", ano: 2018, placa: "YZA-3456" },
  ];

  for (const carro of carrosExtras) {
    await prisma.carro.create({
      data: {
        cliente_id: cliente1.id,
        ...carro,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
