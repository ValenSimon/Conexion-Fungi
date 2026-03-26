'use client'
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner" 

export default function AddToCart({ product }: { product: any }) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)

    // Verificamos si hay stock
    const stockDisponible = product.stock || 0
    const hayStock = stockDisponible > 0

    // 1. Impedir que baje de 1 o suba más del stock real
    const handleIncrease = () => {
        if (quantity < stockDisponible) {
            setQuantity(prev => prev + 1)
        } else {
            toast.error("Límite de stock alcanzado", {
                description: `Lo sentimos, solo tenemos ${stockDisponible} unidades de este producto.`
            })
        }
    }
    
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

    const handleAdd = () => {
        if (!hayStock) return;

        addToCart({ ...product, quantity })
        
        toast.success('¡Agregado con éxito!', {
            description: `${quantity}x ${product.name} ya está en tu carrito.`,
            style: {
                background: '#FFF9F3',
                border: '1px solid #FFC789',
                color: '#4B2C20'
            },
        })

        setQuantity(1)
    }

    return (
        <div className="flex flex-col gap-4 w-full lg:mt-6">
            {/* Indicador de stock visual */}

            <div className="flex items-center gap-2 mb-1 px-3 py-2 border-1 border-[#F59F40] text-sm rounded-xl w-fit">
                <span className={`h-2 w-2 rounded-full ${hayStock ? 'bg-[#F59F40]' : 'bg-red-500 animate-pulse'}`}></span>
                <p className={`text-xs font-bold uppercase tracking-wider ${hayStock ? 'text-gray-500' : 'text-red-500'}`}>
                    {hayStock ? `${stockDisponible} unidades disponibles` : 'Sin stock disponible'}
                </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full">
                {/* Selector de Cantidad - Se deshabilita si no hay stock */}
                <div className={`flex items-center justify-between w-[120px] sm:w-[180px] shrink-0 gap-3 shadow-sm border border-[#D9D9D9] rounded-xl px-4 py-2 bg-white ${!hayStock && 'opacity-50 grayscale'}`}>
                    <button 
                        onClick={handleDecrease} 
                        disabled={!hayStock}
                        type="button" 
                        className="hover:scale-110 transition-transform disabled:cursor-not-allowed"
                    >
                        <img className="w-4" src="/extras/minus.png" alt="minus" />
                    </button>
                    
                    <p className="text-lg font-bold select-none">{hayStock ? quantity : 0}</p>
                    
                    <button 
                        onClick={handleIncrease} 
                        disabled={!hayStock}
                        type="button" 
                        className="hover:scale-110 transition-transform disabled:cursor-not-allowed"
                    >
                        <img className="w-4" src="/extras/plus.png" alt="plus" />
                    </button>
                </div>

                {/* Botón Principal */}
                <button 
                    onClick={handleAdd} 
                    disabled={!hayStock}
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                        hayStock 
                        ? "bg-[#F59F40] hover:bg-[#333]" 
                        : "bg-gray-300 cursor-not-allowed shadow-none"
                    }`}
                >
                    {hayStock ? "Añadir al Carrito" : "Agotado"}
                </button>
            </div>
            
            {!hayStock && (
                <p className="text-[10px] text-gray-400 italic text-center">
                    Estamos trabajando para reponer este producto pronto.
                </p>
            )}
        </div>
    )
}