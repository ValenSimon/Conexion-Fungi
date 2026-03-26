



interface Producto {
  name: string;
  price: number;
  short_description?: string;
  [key: string]: any;
}

export default function ProductInfo({ product }: { product: Producto }) {
    return (
        <div className="flex flex-col items-start gap-3">
            <div>
                <h2 className="font-bold text-3xl lg:text-4xl">{product.name}</h2>
            </div>
            <div>
                <p className="font-semibold text-xl text-[#F59F40] lg:text-2xl">{product.price.toLocaleString('es-AR')} ARS</p>
            </div>
            <div>
                <div>
                    <p className="lg:text-lg ">{product.short_description}</p>
                </div>
            </div>
        </div>
    )
}