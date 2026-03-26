// @/components/product/featured_products.tsx
import { supabase } from "@/src/lib/supabaseClient";
import ProductCard from "./product_card";

// Al ser un Server Component, podemos usar async directamente
export async function FeaturedProducts() {
  // 1. Fetch de datos en el servidor (Cero latencia de cliente)
  const { data: featuredProducts, error } = await supabase
    .from('Products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  if (error) {
    console.error("Error cargando destacados:", error);
    return null;
  }

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="flex flex-col gap-10 2xl:gap-20 2xl:mt-20">
      <div>
        <h2 className="text-center text-2xl font-bold font-Nunito sm:text-4xl 2xl:text-5xl">
          Productos Destacados
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-10 xl:grid-cols-4 xl:gap-14 2xl:grid-cols-4">
        {featuredProducts.map((product) => (
          <div className="flex flex-col gap-2 font-Nunito" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}