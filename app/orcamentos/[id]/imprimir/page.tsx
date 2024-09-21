import { Separator } from "@/app/_components/ui/separator";
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
    <div>
      <div className="page-header ">
        <div className="text-center w-full flex justify-between">
          <div className="flex gap-2 text-left">
            <div>
              <Image
                src={"/logo-brotherscar.png"}
                alt="logo-brotherscar"
                width={170}
                height={150}
                className="object-cover"
              />
            </div>
            <div className="py-2 text-left">
              <div>
                <h1 className="text-xl font-bold">Brothers Car</h1>
                <span className="text-xs">Oficina Mecânica</span>
                <p className="text-xs">brotherscarauto@gmail.com</p>
                <p className="text-xs">61 3773.5868 / 61 98346.5493</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div>
              <h3 className="text-3xl font-bold text-gray-500">Orçamento</h3>
            </div>
            <div>{orcamento.id}</div>
          </div>
        </div>
        <div>
          <div className="mt-1 grid grid-cols-3 w-full justify-center">
            <div className="col-span-1 flex justify-start">
              <div>
                <h4>Cliente:</h4>
                <div>
                  <p className="font-bold">{orcamento.cliente.nome}</p>
                  {orcamento.cliente.email && (
                    <p className="text-xs">{orcamento.cliente.email}</p>
                  )}
                  {orcamento.cliente.telefone && (
                    <p className="text-xs">{orcamento.cliente.telefone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex justify-start">
              <div>
                <h4>Carro:</h4>
                <div>
                  <p className="font-bold">
                    {orcamento.carro.marca} {orcamento.carro.modelo}
                  </p>
                  <p className="text-xs">{orcamento.carro.placa}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex justify-end items-end">
              <div className="flex flex-col">
                <p className="uppercase pl-24">Valor Total</p>
                <p className="font-bold align-bottom bg-gray-300 p-3 pl-14 pr-4 rounded-xl">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(orcamento.valor_total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-footer w-full">
        <div className="">
          <Separator />
          <div className="flex">
            <div className="w-2/4">
              <p>Brothers Car</p>
            </div>
            <div className="grid grid-cols-2 w-2/4 items-center">
              <div className="text-xs text-center">61 3773.5868</div>
              <div className="text-xs text-center">
                brotherscarauto@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <td>
              <div className="page-header-space"></div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="font-bold text-start">Serviços / Peças</td>
            <td className="font-semibold text-center">Quantidade</td>
            <td className="font-semibold text-end">Valor Unitário</td>
            <td className="font-semibold text-end">Valor Total</td>
          </tr>
          {orcamento.itens.map((item) => (
            <tr>
              <td className="text-start max-w-56">{item.descricao}</td>
              <td className="text-center">{item.quantidade}</td>
              <td className="text-end">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.valor / item.quantidade)}
              </td>
              <td className="text-end">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.valor)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td>
              <div className="page-footer-space"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrcamentoDetalhes;
