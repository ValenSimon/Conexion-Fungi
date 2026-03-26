import Image from "next/image";

export default function Hero() {
  return (
    <div className="h-[85vh] md:h-[90vh] w-full overflow-hidden relative">
      {/* 1. Imagen para ESCRITORIO (Se muestra en pantallas grandes) */}
      <div className="hidden xl:block">
        <Image
          src="/extras/hero.webp"
          alt="Conexión Fungi - Bienestar Natural"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* 2. Imagen para TABLET (Entre 768px y 1500px) */}
      <div className="hidden md:block xl:hidden">
        <Image
          src="/extras/image_hero_tablet.webp"
          alt="Conexión Fungi - Bienestar Natural"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* 3. Imagen para MÓVIL (Hasta 768px) */}
      <div className="block md:hidden">
        <Image
          src="/extras/image_hero_mobile.webp"
          alt="Conexión Fungi - Bienestar Natural"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[80%_center]"
          sizes="100vw"
        />
      </div>
    </div>
  );
}