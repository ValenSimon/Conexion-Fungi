export const ServiciosData  = [

  {

    id: 1,

    name: "Astrología Maya ",

    short_description: "Consultas de astrología maya para predecir el futuro de tus cultivos.",

    description: "La astrología maya es una sabiduría ancestral que nos invita a reconectar con los ritmos de la naturaleza y con nuestra esencia más profunda. A través del estudio del calendario sagrado Tzolk’in, podemos conocer nuestro Nawal de nacimiento, comprendiendo así nuestras cualidades, desafíos y propósito de vida. En Conexión Fungi ofrecemos un espacio de guía y acompañamiento donde realizamos lecturas personalizadas de astrología maya y carta natal, brindando herramientas para el autoconocimiento, la toma de decisiones conscientes y el desarrollo espiritual. Cada consulta es una invitación a mirarte en profundidad y alinearte con tu propio camino.",

    mobile_description : "La astrología maya es una sabiduría ancestral que nos invita a reconectar con los ritmos de la naturaleza y con nuestra esencia más profunda. A través del estudio del calendario sagrado Tzolk’in, podemos conocer nuestro Nawal de nacimiento, comprendiendo así nuestras cualidades, desafíos y propósito de vida. En Conexión Fungi ofrecemos un espacio de guía y acompañamiento donde realizamos lecturas personalizadas de astrología maya y carta natal, brindando herramientas para el autoconocimiento, la toma de decisiones conscientes y el desarrollo espiritual. Cada consulta es una invitación a mirarte en profundidad y alinearte con tu propio camino." ,
    
    image: "/servicios/astrologia.webp",

  },

    {

    id: 2,

    name: "Hongos adaptógenos",

    short_description: "Envíos seguros a todo el país.",

    description: "Los hongos adaptógenos son aliados naturales que ayudan al cuerpo a recuperar su equilibrio y adaptarse al estrés físico, mental y emocional. Utilizados desde hace siglos en distintas tradiciones, estos hongos trabajan de manera sutil pero profunda, fortaleciendo el sistema inmunológico, mejorando la energía vital y promoviendo la claridad mental. En Conexión Fungi ofrecemos asesoramiento y productos cuidadosamente seleccionados, acompañando a cada persona en la incorporación consciente de estos aliados a su rutina diaria. Nuestra propuesta busca reconectar con lo natural, potenciando el bienestar integral desde una mirada holística.",

    mobile_description : "Los hongos adaptógenos son aliados naturales que ayudan al cuerpo a recuperar su equilibrio y adaptarse al estrés físico, mental y emocional. Utilizados desde hace siglos en distintas tradiciones, estos hongos trabajan de manera sutil pero profunda, fortaleciendo el sistema inmunológico, mejorando la energía vital y promoviendo la claridad mental. En Conexión Fungi ofrecemos asesoramiento y productos cuidadosamente seleccionados, acompañando a cada persona en la incorporación consciente de estos aliados a su rutina diaria. Nuestra propuesta busca reconectar con lo natural, potenciando el bienestar integral desde una mirada holística.",
    
    image: "/servicios/hongos.webp",

  },

    {

    id: 3,

    name: "Nutrición",

    short_description: "Orientaciones para mejorar la alimentación",

    description: "Nuestra propuesta de nutrición se basa en una mirada consciente e integral del bienestar, entendiendo que alimentarse es mucho más que comer: es nutrir el cuerpo, la mente y la energía. A través del uso de hongos adaptógenos y productos orgánicos y naturales, acompañamos a cada persona en el desarrollo de una alimentación personalizada, libre de ultraprocesados y de sustancias artificiales que no aportan al equilibrio real del organismo. Estos aliados naturales, utilizados desde hace siglos, ayudan a adaptarse al estrés, fortalecer el sistema inmunológico y potenciar la energía vital, integrándose de forma armónica en la rutina diaria. Nuestro enfoque reconoce que cada cuerpo es único, por eso brindamos orientación para construir hábitos sostenibles, reconectar con la intuición alimentaria y lograr un bienestar profundo y duradero.",

    mobile_description : "Nuestra propuesta de nutrición se basa en una mirada consciente e integral del bienestar, entendiendo que alimentarse es mucho más que comer: es nutrir el cuerpo, la mente y la energía. A través del uso de hongos adaptógenos y productos orgánicos y naturales, acompañamos a cada persona en el desarrollo de una alimentación personalizada, libre de ultraprocesados y de sustancias artificiales que no aportan al equilibrio real del organismo. Estos aliados naturales, utilizados desde hace siglos, ayudan a adaptarse al estrés, fortalecer el sistema inmunológico y potenciar la energía vital, integrándose de forma armónica en la rutina diaria. Nuestro enfoque reconoce que cada cuerpo es único, por eso brindamos orientación para construir hábitos sostenibles, reconectar con la intuición alimentaria y lograr un bienestar profundo y duradero.",
    
    image: "/servicios/nutricion.webp",

  },

  {

    id: 4,

    name: "Medicina Escalar",

    short_description: "Aprende las técnicas más avanzadas con nosotros.",

    description: "Los tratamientos de medicina escalar se basan en el uso de frecuencias energéticas que actúan sobre el campo electromagnético del cuerpo, buscando restablecer su equilibrio natural y favorecer procesos de armonización profunda. A través de nuestra tecnología especializada, realizamos consultas personalizadas en las que se evalúa el estado energético de cada persona, permitiendo identificar posibles bloqueos o desajustes. Este enfoque no invasivo trabaja a nivel físico, emocional y energético, acompañando al organismo en su capacidad natural de autorregulación. Cada sesión es única y se adapta a las necesidades individuales, brindando un espacio de cuidado, reconexión y bienestar integral.",  

    mobile_description : "Los tratamientos de medicina escalar se basan en el uso de frecuencias energéticas que actúan sobre el campo electromagnético del cuerpo, buscando restablecer su equilibrio natural y favorecer procesos de armonización profunda. A través de nuestra tecnología especializada, realizamos consultas personalizadas en las que se evalúa el estado energético de cada persona, permitiendo identificar posibles bloqueos o desajustes. Este enfoque no invasivo trabaja a nivel físico, emocional y energético, acompañando al organismo en su capacidad natural de autorregulación. Cada sesión es única y se adapta a las necesidades individuales, brindando un espacio de cuidado, reconexión y bienestar integral.",
    
    image: "/servicios/escalar.webp",

  },





];


export function getProductById(id) {
    const productId = parseInt(id);
    for (const seccion of SECCIONES_CATALOGO) {
        const product = seccion.products.find(p => p.id === productId);
        if (product) return product;
    }
    return null;
}
