import { supabase } from "@/src/lib/supabaseClient";
import ProductCard from "@/components/product/product_card";
import { notFound } from "next/navigation";
import Image from "next/image";
import filterIcon from "@/public/extras/filter.png";
import Link from "next/link";

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  
  const { categoria: rawCategoria } = await params;
  const categoriaSlug = decodeURIComponent(rawCategoria).toLowerCase();

  // 1. Buscamos la categoría en la tabla Categories usando el slug
  const { data: categoryData, error: catError } = await supabase
    .from('Categories')
    .select('*')
    .ilike('slug', categoriaSlug) // ilike no distingue entre mayúsculas y minúsculas
    .single();

  if (catError || !categoryData) {
    return notFound();
  }

  // 2. Buscamos todos los productos que pertenezcan a esa categoría
  const { data: products, error: prodError } = await supabase
    .from('Products')
    .select('*')
    .eq('category_id', categoryData.id);

  if (prodError) {
    console.error("Error cargando productos de la categoría:", prodError);
  }

  return (
    <main className="mt-10 mx-[5%] 2xl:mx-[15%] font-Nunito">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 mb-4">
        <Link href="/catalogo" className="hover:underline">Catálogo</Link> / {categoryData.name}
      </nav>

      <div className="flex flex-col gap-6 mb-8">            
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold sm:text-4xl 2xl:text-5xl capitalize">
            {categoryData.name}
          </h1>
          {/* Si tienes una columna 'description' en Categories, úsala aquí */}
          <p className="leading-5 text-[#575757]">
            {categoryData.description || `Explora nuestra selección de productos de ${categoryData.name}.`}
          </p>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-2 gap-10 xl:grid-cols-4 xl:gap-14 2xl:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center py-20 text-gray-400">
            Próximamente más productos en esta categoría.
          </p>
        )}
      </div>
    </main>
  );
}