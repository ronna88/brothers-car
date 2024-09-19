"use client"

import { UserPlus } from "lucide-react"
import { Button } from "../_components/ui/button"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import ClientesTable from "../_components/ClienteTable"
import ClienteSearch from "../_components/ClienteSearch"
import { Suspense, useEffect, useState } from "react"

const ClientesPage = () => {
  const searchParams = useSearchParams()
  const nome = searchParams.get("nome") || ""
  const [clientes, setClientes] = useState([])
  const [carregados, setCarregados] = useState(false)

  const fetchClientes = async (nome: string) => {
    const response = await fetch(`/api/cliente?nome=${nome}`)
    const data = await response.json()
    setClientes(data)
  }

  useEffect(() => {
    fetchClientes(nome)
  }, [nome])

  useEffect(() => {
    if (!carregados) {
      setCarregados(true)
      fetchClientes(nome)
    }
  }, [carregados, nome])

  useEffect(() => {
    console.log(clientes)
  }, [clientes])

  return (
    <div>
      <div className="p-5">
        <ClienteSearch />

        <div className="relative mt-8 h-[150px] w-full">
          <Image
            src="/banner1.png"
            alt="Banner Brother's Car"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase">Clientes</h2>
        <div className="flex flex-col gap-4 overflow-auto">
          <div>
            <Button>
              <Link href={`clientes/form`} className="flex flex-row gap-2">
                <UserPlus size={20} />
                <span> Adicionar Cliente</span>
              </Link>
            </Button>
          </div>
          {nome !== "" && (
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Resultados para &quot;{nome}&quot;
            </h2>
          )}
          <Suspense fallback={<div>Carregando...</div>}>
            <ClientesTable clientes={clientes} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const ClientesPageWrapper = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <ClientesPage />
  </Suspense>
)

export default ClientesPageWrapper
