import Link from 'next/link';
import Image from 'next/image'; // 1. Importamos el componente optimizado

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="h-full">
            <div className="flex flex-col gap-2 font-Nunito w-full h-full">
                
                {/* 2. El contenedor DEBE ser relative para que Image fill funcione */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl h-[200px] sm:h-[300px]">
                    <Image 
                        src={product.image_url} 
                        alt={product.name}
                        fill // 3. Hace que la imagen ocupe todo el div padre
                        className="object-cover" // Mantiene el recorte centrado
                        // 4. EL TRUCO MÁGICO: Le dice al navegador qué tamaño real 
                        // ocupará la imagen en pantalla según el dispositivo.
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-left text-[#575757] font-semibold text-lg sm:text-xl md:text-2xl min-h-20 flex items-center">
                        {product.name}
                    </h3>

                    <div className="mt-auto">
                        <p className="text-left font-semibold font-montserrat sm:text-lg md:text-xl">
                            {product.price.toLocaleString('es-AR')} ARS
                        </p>
                        <Link 
                            href={`/producto/${product.id}`} 
                            className="block mt-1 text-center border border-[#575757] py-2 rounded-md font-semibold hover:bg-[#EF9B51] hover:text-white transition-colors duration-500 sm:text-lg md:text-xl"
                        >
                            Ver Más
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}