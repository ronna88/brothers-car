import { Table, TableHeader } from "@/app/_components/ui/table";
import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

interface OrcamentoPageProps {
  params: {
    id: number;
  };
}

interface Orcamento {
  id: number;
  descricao: string | null;
  data_criacao: Date;
  valor_total: number;
  status: string;
  carro: {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
  };
  cliente: {
    id: number;
    nome: string;
    cpf: string | null;
    email: string | null;
    telefone: string | null;
    endereco: string | null;
  };
  itens: {
    id: number;
    descricao: string | null;
    quantidade: number;
    valor: number;
  }[];
}

const OrcamentoDetalhes = async ({ params }: OrcamentoPageProps) => {
  const orcamentoDetails = await db.orcamento.findUnique({
    where: {
      id: parseInt(params.id + ""),
    },
    include: {
      carro: true,
      cliente: true,
      itens: true,
    },
  });

  if (!orcamentoDetails) {
    return notFound();
  }

  const orcamento: Orcamento = orcamentoDetails;

  return (
    <div className="flex w-full items-center gap-3 flex-col">
      <div className="bg-slate-200 w-11/12 flex justify-between p-4 rounded-3xl cabecalho">
        <div className="flex gap-11 flex-col">
          <h2 className="text-xl font-bold">Orçamento</h2>
          <div>
            <div className="flex flex-col">
              <h4>Cliente:</h4>
              <div className="p-2">
                <p className="font-bold">{orcamento.cliente.nome}</p>
                {orcamento.cliente.cpf && (
                  <p className="text-xs">{orcamento.cliente.cpf}</p>
                )}
                {orcamento.cliente.email && (
                  <p className="text-xs">{orcamento.cliente.email}</p>
                )}
                {orcamento.cliente.telefone && (
                  <p className="text-xs">{orcamento.cliente.telefone}</p>
                )}
                {orcamento.cliente.endereco && (
                  <p className="text-xs">{orcamento.cliente.endereco}</p>
                )}
                {orcamento.carro && (
                  <p className="font-bold">
                    {orcamento.carro.marca} - {orcamento.carro.modelo} -{" "}
                    {orcamento.carro.placa}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-11">
          <div className="flex flex-col items-end">
            <p className="text-xs">Orçamento No.</p>
            <p className="text-xl font-bold mr-0">{orcamento.id}</p>
          </div>

          <div>
            <div className="flex flex-col items-end">
              <p className="text-xs">Data do Orçamento</p>
              <p>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(orcamento.data_criacao))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-10 orcamento-itens">
        <div className="w-11/12 mb-12">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex justify-center">
              <p className="text-lg font-bold">Serviços / Peças</p>
            </div>
            <div className="flex justify-center">
              <p className="text-lg font-bold">Quantidade</p>
            </div>
            <div className="flex justify-center">
              <p className="text-lg font-bold">Valor Unitário</p>
            </div>
            <div className="flex justify-center">
              <p className="text-lg font-bold">Valor Total</p>
            </div>
          </div>
        </div>

        {orcamento.itens.map((item) => (
          <div className="w-11/12 mb-4 orcamento-item">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex justify-center">
                <p className="text-sm">{item.descricao}</p>
              </div>
              <div className="flex justify-center">
                <p className="text-sm">{item.quantidade}</p>
              </div>
              <div className="flex justify-center">
                <p className="text-sm">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.valor / item.quantidade)}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="text-sm">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.valor)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-11/12 rodape">
        <div className="grid grid-cols-3">
          <div className="col-span-2"></div>
          <div className="flex flex-col items-center bg-slate-200 px-1 py-2 rounded-3xl">
            <p className="text-base font-bold">
              Total do Orçamento&nbsp;&nbsp;&nbsp;&nbsp;
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(orcamento.valor_total)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 px-6">
          <div className="col-span-2">
            <Image
              src={"/logo-brotherscar.png"}
              width={100}
              height={100}
              alt="logo-brothers-car"
            />
          </div>
        </div>
        <div className="flex gap-20 p-6">
          <div className="w-48 flex flex-col gap-1">
            <h2 className="uppercase font-extrabold text-xl">Brothers car</h2>
            <p className="uppercase text-sm">MECÂNICA EM GERAL</p>
            <p className="uppercase text-sm">
              SOF Norte Quadra 4 Conjunto B - Loja 65 B. Brasilia, DF
            </p>
            <p className="uppercase text-sm">61 3773.5868 - 61 98346.5493</p>
          </div>
          <div>
            <h3 className="uppercase font-bold text-base">
              Instruções de Pagamento
            </h3>
            <span className="text-sm">
              - Pagamento à vista em dinheiro ou cartão de débito.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoDetalhes;
