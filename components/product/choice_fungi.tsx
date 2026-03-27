


export function ChoiceFungi() {
    const choices = [
        {
            id: 1,
            title: "Ingredientes 100% naturales",
            description: "Elaboramos productos a base de hongos medicinales y extractos naturales, pensados para acompañar tu bienestar de forma natural.",
            image: "/logos/logo1.webp"
        },
        {
            id: 2,
            title: " Sabiduría ancestral + conocimiento moderno",
            description: "Combinamos el uso de hongos medicinales con investigación actual para crear productos naturales efectivos que apoyan el bienestar.",
            image: "/logos/logo2.webp"
        },
        {
            id: 3,
            title: "El poder de los adaptógenos naturales",
            description: "Los hongos adaptógenos ayudan al cuerpo a adaptarse al estrés y a mantener su equilibrio natural, promoviendo bienestar de forma suave y natural.",
            image: "/logos/logo3.webp"
        },
        {
            id: 4,
            title: "Bienestar integral y natural",
            description: "Nuestros productos buscan equilibrar cuerpo, mente y piel, promoviendo una conexión real entre la naturaleza y tu bienestar diario.",
            image: "/logos/logo4.webp"
        }
    ]
    return (
        <div className="flex flex-col gap-10 2xl:gap-20 2xl:mb-20 ">
            <div>
                <h2 className=" text-center text-2xl font-bold  font-Nunito sm:text-4xl 2xl:text-5xl ">¿Por qué elegirnos?</h2>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-14 2xl:gap-20">
                {choices.map(choice => (
                    <div className="flex flex-col gap-5 font-Nunito items-center " key={choice.id}>
                        <div className="border border-gray-100 p-4 py-5 rounded-full bg-white drop-shadow-[0_0_15px_rgba(245,159,64,0.7)]">
                            <img
                                className="rounded-xl text-[#575757] w-20 h-full object-contain md:w-24"
                                src={choice.image}
                                alt={choice.title}
                            />
                        </div>
                        <div className="flex flex-col gap-3 text-center">
                            <h3 className="text-center font-bold text-lg font-montserrat line-clamp-2 md:text-xl xl:text-md 2xl:text-xl ">{choice.title}</h3>
                            <p className="text-center text-pretty md:text-xl xl:text-base ">{choice.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}