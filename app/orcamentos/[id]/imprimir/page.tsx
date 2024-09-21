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

      <table>
        <thead>
          <tr>
            <td>
              <div className="page-header-space"></div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <div className="page">PAGE 1</div>
              <div className="page">PAGE 2</div>
              <div className="page" style={{ lineHeight: 3 }}>
                PAGE 3 - Long Content
                <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nunc tincidunt metus eu consectetur rutrum. Praesent tempor
                facilisis dapibus. Aliquam cursus diam ac vehicula pulvinar.
                Integer lacinia non odio et condimentum. Aenean faucibus cursus
                mi, sed interdum turpis sagittis a. Quisque quis pellentesque
                mi. Ut erat eros, posuere sed scelerisque ut, pharetra vitae
                tellus. Suspendisse ligula sapien, laoreet ac hendrerit sit
                amet, viverra vel mi. Pellentesque faucibus nisl et dolor
                pharetra, vel mattis massa venenatis. Integer congue condimentum
                nisi, sed tincidunt velit tincidunt non. Nulla sagittis sed
                lorem pretium aliquam. Praesent consectetur volutpat nibh, quis
                pulvinar est volutpat id. Cras maximus odio posuere suscipit
                venenatis. Donec rhoncus scelerisque metus, in tempus erat
                rhoncus sed. Morbi massa sapien, porttitor id urna vel, volutpat
                blandit velit. Cras sit amet sem eros. Quisque commodo facilisis
                tristique. Proin pellentesque sodales rutrum. Vestibulum purus
                neque, congue vel dapibus in, venenatis ut felis. Donec et
                ligula enim. Sed sapien sapien, tincidunt vitae lectus quis,
                ultricies rhoncus mi. Nunc dapibus nulla tempus nunc interdum,
                sed facilisis ex pellentesque. Nunc vel lorem leo. Cras pharetra
                sodales metus. Cras lacus ex, consequat at consequat vel,
                laoreet ac dui. Curabitur aliquam, sapien quis congue feugiat,
                nisi nisl feugiat diam, sed vehicula velit nulla ac nisl.
                Aliquam quis nisi euismod massa blandit pharetra nec eget nunc.
                Etiam eros ante, auctor sit amet quam vel, fringilla faucibus
                leo. Morbi a pulvinar nulla. Praesent sed vulputate nisl. Orci
                varius natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus. Aenean commodo mollis iaculis. Maecenas
                consectetur enim vitae mollis venenatis. Ut scelerisque pretium
                orci id laoreet. In sit amet pharetra diam. Vestibulum in
                molestie lorem. Nunc gravida, eros non consequat fermentum, ex
                orci vestibulum orci, non accumsan sem velit ac lectus. Vivamus
                malesuada lacus nec velit dignissim, ac fermentum nulla pretium.
                Aenean mi nisi, convallis sed tempor in, porttitor eu libero.
                Praesent et molestie ante. Duis suscipit vitae purus sit amet
                aliquam. Vestibulum lectus justo, lobortis a purus a, dapibus
                efficitur metus. Suspendisse potenti. Duis dictum ex lorem.
                Suspendisse nec ligula consectetur magna hendrerit ullamcorper
                et eget mauris. Etiam vestibulum sodales diam, eget venenatis
                nunc luctus quis. Ut fermentum placerat neque nec elementum.
                Praesent orci erat, rhoncus vitae est eu, dictum molestie metus.
                Cras et fermentum elit. Aenean eget augue lacinia, varius ante
                in, ullamcorper dolor. Cras viverra purus non egestas
                consectetur. Nulla nec dolor ac lectus convallis aliquet sed a
                metus. Suspendisse eu imperdiet nunc, id pulvinar risus.
                Maecenas varius sagittis est, vel fermentum risus accumsan at.
                Vestibulum sollicitudin dui pharetra sapien volutpat, id
                convallis mi vestibulum. Phasellus commodo sit amet lorem quis
                imperdiet. Proin nec diam sed urna euismod ultricies at sed
                urna. Quisque ornare, nulla et vehicula ultrices, massa purus
                vehicula urna, ac sodales lacus leo vitae mi. Sed congue
                placerat justo at placerat. Aenean suscipit fringilla vehicula.
                Quisque iaculis orci vitae arcu commodo maximus. Maecenas nec
                nunc rutrum, cursus elit quis, porttitor sapien. Sed ac
                hendrerit ipsum, lacinia fringilla velit. Donec ultricies
                feugiat dictum.
              </div>
            </td>
          </tr>
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
