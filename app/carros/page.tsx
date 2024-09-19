"use client"

import { UserPlus } from "lucide-react"
import { Button } from "../_components/ui/button"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import CarrosTable from "../_components/CarrosTable"
import CarroSearch from "../_components/CarroSearch"
import { Suspense, useEffect, useState } from "react"

const Home = () => {
  //TODO: Implementar a entidade Carros
  const searchParams = useSearchParams()
  const placa = searchParams.get("placa") || ""
  const [carros, setCarros] = useState([])
  const [carregados, setCarregados] = useState(false)

  const fetchCarros = async (placa: string) => {
    const response = await fetch(`/api/carro?placa=${placa}`)
    const data = await response.json()
    setCarros(data)
  }

  // Reexecuta quando o parâmetro de busca mudar
  useEffect(() => {
    fetchCarros(placa)
  }, [placa])

  useEffect(() => {
    if (!carregados) {
      setCarregados(true)
      fetchCarros(placa)
    }
  }, [carregados, placa])

  useEffect(() => {
    console.log(carros)
  }, [carros])

  return (
    <div>
      <div className="p-5">
        <CarroSearch />

        <div className="relative mt-8 h-[150px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase">Carros</h2>
        <div className="flex flex-col gap-4 overflow-auto">
          <div>
            <Button>
              <Link href={`carros/form`} className="flex flex-row gap-2">
                <UserPlus size={20} />
                <span> Adicionar Carro</span>
              </Link>
            </Button>
          </div>
          {placa !== "" && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Resultados para &quot;{placa}&quot;
            </h2>
          )}
          <Suspense fallback={<div>Carregando...</div>}>
            <CarrosTable carros={carros} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Home
