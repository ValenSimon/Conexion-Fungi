import Image from "next/image";
import Hero from "@/components/ui/hero"
import { ChoiceFungi } from "@/components/product/choice_fungi"
import { FeaturedProducts } from "@/components/product/featured_products"

export default function Home() {
  return (
    <div className="">
      <Hero/>
      <div className=" flex flex-col gap-10 mt-10 mx-[10%] md:gap-20 2xl:mx-[15%] 2xl:gap-30">
        <FeaturedProducts />
        <ChoiceFungi />
      </div>
    </div>
  );
}
