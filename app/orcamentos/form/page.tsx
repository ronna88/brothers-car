import OrcamentoForm from "@/app/_components/OrcamentoForm"

const OrcamentoFormPage = () => {
  return (
    <div className="mt-6 grid w-full grid-cols-1">
      <div className="flex justify-center">
        <h2 className="font-bold">Criação de Orçamento</h2>
      </div>
      <div className="mt-6 flex justify-center">
        <OrcamentoForm />
      </div>
    </div>
  )
}

export default OrcamentoFormPage
