"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

interface RelatedProps {
  category: string;
  currentId: number;
}

export default function RelatedProducts({ category, currentId }: RelatedProps) {
    const [related, setRelated] = useState([]);

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
        <div className="flex flex-col gap-4 mt-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold font-Nunito sm:text-3xl">También te puede interesar</h2>
                <p className="text-[#575757]">Complementa tu vida de bienestar con alguno de estos productos</p>
            </div>
            <div className="grid grid-cols-2 gap-10 xl:grid-cols-4 xl:gap-14 2xl:grid-cols-4">
                {related.map(product => (
                    <div className="flex flex-col gap-2 font-Nunito transition duration-300" key={product.id}>
                        <div className="relative aspect-square">
                            <img 
                                className="rounded-xl text-[#575757] w-full h-full object-cover" 
                                src={product.image_url} 
                                alt={product.name} 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-left text-[#575757] font-semibold text-lg min-h-16 flex items-center sm:text-xl md:text-[23px]">
                                {product.name}
                            </h3>
                            <p className="text-left font-semibold font-montserrat sm:text-lg">
                                {product.price.toLocaleString('es-AR')} ARS
                            </p>
                            <button className="mt-1 text-center border-1 border-[#575757] py-2 rounded-md font-semibold hover:bg-[#EF9B51] hover:text-white transition-colors duration-500 sm:text-lg md:text-xl">
                                Ver Más
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}