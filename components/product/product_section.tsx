
import Link from 'next/link'
import ProductCard from "./product_card"
import arrowright from "@/public/extras/arrow.png"
import separator from "@/public/extras/separator.png"
export default function ProductSection({ title, products = [], slug }) {
    return (
        <section className="flex flex-col gap-10 2xl:gap-20">
            <div className="flex justify-between items-center">
                <div className=" flex items-center gap-2">
                    <img className="w-1.5 sm:w-2" src={separator.src} alt="separator" />
                    <h2 className="text-xl font-bold font-Nunito sm:text-4xl 2xl:text-5xl">{title}</h2>
                </div>
                <div>
                    <Link href={`/catalogo/${slug}`} className="flex items-center gap-2 text-base sm:text-xl sm:gap-4 text-[#EF8851] ">
                        Ver Todo
                        <img className="w-4 sm:w-6" src={arrowright.src} alt="arrowright" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 xl:grid-cols-4 xl:gap-14 2xl:grid-cols-4 ">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}