"use client"

import { UserPlus } from "lucide-react"
import { Button } from "../_components/ui/button"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import OrcamentosTable from "../_components/OrcamentosTable"
import OrcamentoSearch from "../_components/OrcamentoSearch"
import { useEffect, useState } from "react"

const Home = () => {
  const searchParams = useSearchParams()
  const nome = searchParams.get("nome") || ""
  const [orcamentos, setOrcamentos] = useState([])
  const [carregados, setCarregados] = useState(false)

  const fetchOrcamentos = async (nome: string) => {
    const response = await fetch(`/api/orcamento?cliente=${nome}`)
    const data = await response.json()
    setOrcamentos(data)
  }

  useEffect(() => {
    if (!carregados) {
      setCarregados(true)
      fetchOrcamentos(nome)
    }
  }, [carregados, nome])

  useEffect(() => {
    // console.log(orcamentos)
  }, [orcamentos])

  return (
    <div>
      <div className="p-5">
        <OrcamentoSearch />

        <div className="relative mt-8 h-[150px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase">Orçamentos</h2>
        <div className="flex flex-col gap-4 overflow-auto">
          <div>
            <Button>
              <Link href={`orcamentos/form`} className="flex flex-row gap-2">
                <UserPlus size={20} />
                <span> Criar Orçamento</span>
              </Link>
            </Button>
          </div>
          {nome !== "" && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Resultados para &quot;{nome}&quot;
            </h2>
          )}

          <OrcamentosTable orcamentos={orcamentos} />
        </div>
      </div>
    </div>
  )
}

export default Home
