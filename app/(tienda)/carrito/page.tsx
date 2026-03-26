'use client'
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { toast } from "sonner"

export default function CarritoPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()

    const totalFinal = totalPrice;

    // Función auxiliar para validar stock antes de subir
    const handleSumaCantidad = (item: any) => {
        const nuevaCantidad = item.quantity + 1;
        
        // Verificamos si la nueva cantidad supera el stock real
        if (nuevaCantidad > item.stock) {
            toast.error("Límite de stock alcanzado", {
                description: `Lo sentimos, solo quedan ${item.stock} unidades de ${item.name}.`
            });
            return;
        }
        
        updateQuantity(item.id, nuevaCantidad);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-10 px-[5%] ">
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-black ">Tu Carrito de Bienestar</h1>
                <p className="text-[#EF8851] font-semibold">
                    Tienes {cart.reduce((acc, item) => acc + item.quantity, 0)} productos seleccionados.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                <div className="lg:col-span-3 space-y-4">
                    {cart.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl text-center shadow-sm">
                            <p className="text-gray-400 mb-4 text-xl">Tu carrito está vacío</p>
                            <Link href="/catalogo" className="text-[#EF8851] font-bold underline">Volver a la tienda</Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-row items-center gap-4 relative">
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold lg:text-lg text-[#4B2C20]">{item.name}</h3>
                                            <p className="hidden lg:block text-xs text-gray-400 mb-2">Stock disponible: {item.stock}</p>
                                        </div>
                                        <p className="text-[#EF8851] font-black lg:text-xl">${item.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        {/* Controles de Cantidad con Validación */}
                                        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-1 gap-4 border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                className="text-[#EF8851] hover:bg-orange-100 w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleSumaCantidad(item)} 
                                                className="text-[#EF8851] hover:bg-orange-100 w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => { removeFromCart(item.id); toast.error("Producto eliminado") }}
                                            className="text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors p-2 rounded-md flex items-center gap-1 text-xs font-bold"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="pt-4">
                        <Link href="/catalogo" className="text-gray-400 font-bold flex items-center gap-2 hover:text-[#EF8851] transition-colors">
                            ← Seguir Comprando
                        </Link>
                    </div>
                </div>

                {/* RESUMEN DEL PEDIDO */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-6 sticky top-24">
                        <h2 className="text-xl font-bold text-[#4B2C20]">Resumen del Pedido</h2>

                        <div className="space-y-3 text-sm border-b border-gray-100 pb-6 text-gray-500 font-medium">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span className="text-[#EF8851]">A convenir</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#4B2C20]">Total</span>
                            <span className="text-3xl font-black text-[#EF8851]">${totalFinal.toLocaleString()}</span>
                        </div>

                        {cart.length > 0 ? (
                            <Link 
                                href="/formulario-pedido" 
                                className="w-full bg-[#EF8851] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#db974f] transition-all shadow-lg active:scale-95"
                            >
                                Finalizar Compra →
                            </Link>
                        ) : (
                            <button disabled className="w-full bg-gray-200 text-gray-400 py-4 rounded-2xl font-black text-lg cursor-not-allowed">
                                Carrito Vacío
                            </button>
                        )}
                        
                        <div className="text-[10px] text-gray-400 font-bold leading-tight">
                            ⚠️ El precio final no incluye envío. Se calculará por WhatsApp.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}