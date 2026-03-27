"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import separator from "@/public/extras/separator.png";
import Link from "next/link";

interface Producto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  stock?: number;
}

interface RelatedProps {
  category: string;
  currentId: number;
}

export default function RelatedProducts({ category, currentId }: RelatedProps) {
    const [related, setRelated] = useState<Producto[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {

            
            // 1. Limpiamos espacios por si acaso
            const cleanCategory = category.trim();
            

            const { data, error } = await supabase
                .from('Products')
                .select(`
                    *,
                    Categories!inner (
                        name
                    )
                `)
                // IMPORTANTE: Aquí buscamos el nombre exacto
                .eq('Categories.name', cleanCategory) 
                .neq('id', currentId)
                .limit(4);

            if (error) {
                console.error("Error de Supabase:", error.message);
                return;
            }

            setRelated(data || []);
        };

        fetchRelated();
    }, [category, currentId]);
    
    if (related.length === 0) return null;

    return (
    <div className="flex flex-col gap-4 mt-10 sm:px-0">
    {/* Cabecera de sección */}
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <img className="w-1.5 md:w-2" src={separator.src} alt="separator" />
            <h2 className="text-xl font-bold font-Nunito sm:text-3xl text-[#2D2D2D]">
                También te puede interesar
            </h2>
        </div>
        <p className="text-[#575757] text-sm sm:text-base">
            Complementa tu vida de bienestar con alguno de estos productos
        </p>
    </div>

    {/* Grid de Productos - Ajuste de Gap para Móvil */}
    <div className="grid grid-cols-2 gap-4 sm:gap-10 xl:grid-cols-4 xl:gap-14">
        {related.map((product) => (
            <div 
                className="flex flex-col gap-3 font-Nunito transition duration-300 group" 
                key={product.id}
            >
                {/* Contenedor de Imagen Responsivo */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F3F3F3]">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image_url}
                        alt={product.name}
                    />
                </div>

                {/* Info del Producto */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-left text-[#575757] font-semibold text-sm leading-tight min-h-[60px] flex items-center sm:text-lg md:text-xl lg:text-[22px]">
                        {product.name}
                    </h3>
                    
                    <p className="text-left font-bold font-montserrat text-base sm:text-lg text-[#2D2D2D]">
                        {product.price.toLocaleString('es-AR')} ARS
                    </p>

                    <Link
                        href={`/producto/${product.id}`}
                        className="block mt-2 text-center border border-[#575757] py-2 px-1 rounded-md text-sm font-semibold hover:bg-[#EF9B51] hover:text-white hover:border-[#EF9B51] transition-all duration-300 sm:text-lg"
                    >
                        Ver Más
                    </Link>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
}