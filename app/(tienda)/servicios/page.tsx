import Link from "next/link";   
const ServiciosData = [
  {
    id: 1,
    name: "Astrología Maya ",
    description: "Consultas de astrología maya para predecir el futuro de tus cultivos.",
    image: "/servicios/astrologia.jpg",
  },
    {
    id: 2,
    name: "Hongos adaptógenos",
    description: "Envíos seguros a todo el país.",
    image: "/servicios/hongos.jpg",
  },
    {
    id: 3,
    name: "Nutrición",
    description: "Orientaciones para mejorar la alimentación",
    image: "/servicios/nutricion.jpg",
  },
  {
    id: 4,
    name: "Tratamientos con Medicina Escalar",
    description: "Aprende las técnicas más avanzadas con nosotros.",
    image: "/servicios/escalar.jpg",
  },


];

export default function Servicios() {
  return (
    <div className="flex flex-col gap-8 mt-6 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="flex flex-col gap-3">
        <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold font-Nunito sm:text-4xl xl:text-5xl">Mis Servicios</h1>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-center max-w-3xl text-gray-600">
            En Conexion Fungi, nos dedicamos a la venta de productos de alta calidad, pero también ofrecemos servicios especializados para satisfacer las necesidades de nuestros clientes.
          </p>
        </div>
      </div>

      {/* Grid Responsivo: 1 columna en móvil, 2 en tablet, 3 o 4 en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12">
        {ServiciosData.map((servicio) => (
          <div 
            key={servicio.id} 
            className="group relative overflow-hidden rounded-xl shadow-lg bg-black"
          >
            {/* Imagen del Servicio */}
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40" 
              src={servicio.image} 
              alt={servicio.name} 
            />

            {/* Overlay: Aparece al hacer hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
              <h3 className="text-white text-2xl font-bold mb-2 lg:text-3xl ">
                {servicio.name}
              </h3>
              <p className="text-white/90 text-sm mb-4 lg:text-lg">
                {servicio.description}
              </p>
              <Link href={`/servicios/${servicio.id}`}>
                    <button className="px-8 py-2 bg-white text-black font-semibold rounded-lg hover:bg-[#F59F40] hover:text-white transition-colors">
                        Ver más
                    </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}