import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabaseClient"; // Tu cliente
import ProductGallery from "@/components/product/product_gallery";
import ProductInfo from "@/components/product/product_info";
import AddToCart from "@/components/product/add_to_cart";
import DescriptionProduct from "@/components/product/description_product";
import Ingredients from "@/components/product/ingredients";
import RelatedProducts from "@/components/product/related_products";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: product, error } = await supabase
    .from('Products')
    .select(`
        *,
        Categories ( name ),
        product_images ( id, url, alt_text )
    `)
    .eq('id', id)
    .single();  

    if (error || !product) {
        return notFound();
    }
    return (
        <div className="mx-[10%] md:gap-20 2xl:mx-[15%]">
            <Link href="/catalogo" className="text-[#EF8851] font-semibold mt-2 inline-block hover:underline 2xl:mt-4">
                &larr; Volver al Catálogo
            </Link>
            
            <div className="flex flex-col gap-10 lg:flex-col lg:gap-20">
                <div className="mb-6 flex flex-col gap-6 mt-3 lg:flex-row lg:gap-10">
                    <div className="w-full lg:w-1/2">
                        <ProductGallery product={product} images={product.product_images ?? []} />
                    </div>
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                        <ProductInfo product={product} />
                        
                        {/* El botón de agregar al carrito necesitará el producto */}
                        <AddToCart product={product} /> 
                    </div>
                </div>

                <div className="flex flex-col gap-10 lg:flex-row lg:gap-10 lg:items-start">
                    <DescriptionProduct description={product.description} />
                </div>

                <div className="">
                    <RelatedProducts 
                        category={product?.Categories?.name} 
                        currentId={product?.id} 
                    />                
                </div>
            </div>
        </div>
    );
}