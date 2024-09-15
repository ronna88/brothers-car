import ClienteForm from "@/app/_components/ClienteForm"

const ClienteFormPage = () => {
  return (
    <div className="mt-6 grid w-full grid-cols-1">
      <div className="flex justify-center">
        <h2 className="font-bold">Formulário de Clientes</h2>
      </div>
      <div className="mt-6 flex justify-center">
        <ClienteForm />
      </div>
    </div>
  )
}

export default ClienteFormPage
