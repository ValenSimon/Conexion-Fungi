import { ServiciosData } from "@/src/lib/data.js";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Link from "next/link"; 

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const servicio = ServiciosData.find((s) => s.id.toString() === id);

  if (!servicio) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold">Servicio no encontrado</h1>
      </div>
    );
  }

  // 1. Definimos el mensaje dinámico
  const mensaje = `Hola, me interesa obtener más información sobre el servicio: ${servicio.name}`;
  
  // 2. Creamos la URL de WhatsApp formateada
  const whatsappUrl = `https://wa.me/5491122709174?text=${encodeURIComponent(mensaje)}`;


  return (
    <div className="mx-auto min-h-screen pb-10">
      {/* Contenedor del Hero - Altura responsiva */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[35vh] overflow-hidden">
        <Image
          src={servicio.image}
          alt={servicio.name}
          fill
          priority // Carga prioritaria por ser la imagen principal
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Opcional: Overlay oscuro para que el header resalte más si es necesario */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Contenido Principal */}
      <div className="mt-12 flex flex-col justify-center items-center gap-6 px-6 md:px-10 max-w-5xl mx-auto">
        
        <header className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            Servicio {servicio.name}
          </h1>
        </header>

        {/* Descripción adaptable */}
        <div className="w-full text-center">
          {/* Versión Móvil */}
          <div className="block md:hidden text-base leading-relaxed text-gray-600">
            <p>{servicio.mobile_description || servicio.description}</p>
          </div>

          {/* Versión Escritorio */}
          <div className="hidden md:block text-lg leading-relaxed text-gray-700">
            <p>{servicio.description}</p>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="flex items-center justify-center w-full mt-4">
          <Link href={whatsappUrl} target="_blank">
            <button className="w-full md:w-auto px-10 py-4 bg-[#eb992f] hover:bg-[#d48628] text-white font-semibold text-lg transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl active:scale-95">
              Reservar Consulta para {servicio.name}
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}