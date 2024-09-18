import CarroForm from "@/app/_components/CarroForm"

const CarroFormPage = () => {
  return (
    <div className="mt-6 grid w-full grid-cols-1">
      <div className="flex justify-center">
        <h2 className="font-bold">Formulário de Carros</h2>
      </div>
      <div className="mt-6 flex justify-center">
        <CarroForm />
      </div>
    </div>
  )
}

export default CarroFormPage
