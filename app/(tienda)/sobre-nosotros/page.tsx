export default function SobreNosotros() {
  return (
    <section className="py-16 px-[5%] sm:px-[10%] bg-white font-Nunito">
      {/* Título Principal */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          Sobre Nosotros
        </h1>
        <div className="w-24 h-1 bg-[#F59F40] mx-auto mb-8 rounded-full"></div>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 leading-relaxed">
          En <span className="font-bold text-[#F59F40]">Conexión Fungi</span> creemos que el bienestar nace cuando volvemos a lo esencial. 
          Nuestra propuesta surge al entender que el cuidado de la salud es algo integral, donde el cuerpo, 
          la mente y la naturaleza se encuentran.
        </p>
      </div>

      {/* Contenedor de Tarjetas */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Card: Quiénes Somos */}
        <div className="bg-[#F59F40]/10 p-8 rounded-2xl border-l-5 border-[#F59F40] hover:shadow-lg transition-shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F59F40] mb-4">
            ¿Quiénes Somos?
          </h2>
          <p className="text-gray-700 text-md md:text-lg leading-relaxed">
            Somos un proyecto dedicado al bienestar natural inspirado en el poder de la naturaleza 
            y en el potencial de los hongos como aliados del cuidado personal. Creamos propuestas 
            simples, honestas y conectadas con el entorno.
          </p>
        </div>

        {/* Card: Nuestra Misión */}
        <div className="bg-gray-50 p-8 rounded-2xl border-l-5 border-gray-300 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Nuestra Misión
          </h2>
          <p className="text-gray-700 text-md md:text-lg leading-relaxed">
            Promover el bienestar integral a través de productos elaborados con ingredientes 
            naturales que respeten el equilibrio del cuerpo. Buscamos ofrecer alternativas 
            conscientes, poniendo en valor lo simple y lo auténtico.
          </p>
        </div>

      </div>

      {/* Frase de Cierre o Valor Extra */}
      <div className="mt-16 text-center italic text-gray-500 text-lg">
        "Trabajamos con ingredientes puros para acompañar tu bienestar de forma consciente."
      </div>
    </section>
  );
}