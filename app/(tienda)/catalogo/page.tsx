"use client";

import { useEffect, useState } from "react";
import ProductSection from "@/components/product/product_section";
import { supabase } from "@/src/lib/supabaseClient";

interface Producto {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category_id: number;
  categoryName: string; 
  categorySlug: string;
  [key: string]: any; 
}

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Quitamos el .limit(4) de aquí para obtener productos de todas las categorías
        const { data, error } = await supabase
          .from('Products')
          .select(`
            *,
            Categories (
              name,
              slug
            )
          `);

        if (error) {
          console.error("Error de Supabase:", error.message);
        } else if (data) {
          const formateados = data.map((p: any) => ({
            ...p,
            categoryName: p.Categories?.name || "Sin Categoría",
            categorySlug: p.Categories?.slug || "" 
          }));
          setProductos(formateados);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 1. Obtenemos los nombres únicos de las categorías
  const nombresCategorias = Array.from(new Set(productos.map(p => p.categoryName)));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl font-Nunito animate-pulse">Cargando catálogo fungi...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col gap-10 mt-10 mx-[10%] md:gap-20 2xl:mx-[15%] 2xl:gap-30 2xl:mt-15">
        {nombresCategorias.length > 0 ? (
          nombresCategorias.map((catName) => {
            const slugData = productos.find(p => p.categoryName === catName)?.categorySlug;
            
            // 2. FILTRAMOS LOS PRODUCTOS DE ESTA CATEGORÍA Y TOMAMOS SOLO LOS PRIMEROS 4
            const productosLimitados = productos
              .filter(p => p.categoryName === catName)
              .slice(0, 4); // <--- ESTA ES LA CLAVE

            return (
              <ProductSection 
                key={catName} 
                title={catName}
                slug={slugData || ""} 
                products={productosLimitados} 
              />
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No se encontraron productos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}