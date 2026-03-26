
import Form from "@/components/ui/form";
import QuickContact from "@/components/ui/quick_contact";

export default function Contacto() {
    return (
        <div className="flex flex-col gap-6 mt-10 mx-[10%] 2xl:mx-[15%] ">
            <div className="flex flex-col gap-3 xl:gap-6 lg:w-2/3">
                <h1 className="text-2xl font-bold font-Nunito sm:text-4xl xl:text-5xl">Contactá Con Nosotros</h1>
                <p className="sm:text-lg xl:text-xl">¿Tienes preguntas sobre nuestros productos naturales o tu pedido? Estamos aquí para ayudarte en tu camino hacia el bienestar.</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-6 gap-3">
                <div className="w-full md:w-1/2 lg:w-3/5 2xl:w-2/3">
                    <Form />
                </div>
                <div className="w-full md:w-1/2 lg:w-2/5 2xl:w-1/3">   
                    <QuickContact />
                </div>
            </div>
        </div>
    )
}