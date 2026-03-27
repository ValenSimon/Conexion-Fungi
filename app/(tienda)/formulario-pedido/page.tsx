'use client'
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { toast } from "sonner"
import { 
  User, Truck, MessageCircle, 
  Home, Loader2, ChevronLeft 
} from "lucide-react"
import { supabase } from "@/src/lib/supabaseClient"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function FinalizarCompraPage() {
    const { cart, totalPrice, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [metodoEnvio, setMetodoEnvio] = useState<'domicilio'>('domicilio')
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccionManual: '',
        pisoDepto: '', // 👈 NUEVO
        localidadManual: '',
        provincia: '', // 👈 ARREGLADO
        cpManual: '',
    })

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Tu carrito está vacío</h2>
                    <Link href="/catalogo" className="inline-block bg-[#EF8851] text-white px-8 py-3 rounded-xl font-bold">
                        Explorar Catálogo
                    </Link>
                </div>
            </div>
        )
    }

    const handleFinalizarPedido = async () => {
        if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.cpManual) {
            return toast.error("Por favor, completa tus datos personales.")
        }
        
        if (!formData.direccionManual || !formData.localidadManual || !formData.provincia) {
            return toast.error("Ingresa la dirección completa para el envío.")
        }

        setIsSubmitting(true)

        try {
            const pesoTotal = cart.reduce((acc, item) => acc + ((item.weight_grams || 0) * item.quantity), 0)
            
            const direccionFinal = `${formData.direccionManual}${formData.pisoDepto ? `, ${formData.pisoDepto}` : ''}, ${formData.localidadManual}, ${formData.provincia} (CP: ${formData.cpManual})`

            const cartItemsJSON = cart.map(item => ({
                id: item.id,
                nombre: item.name,
                cantidad: item.quantity,
                precio: item.price
            }))

            const { data: pedido, error } = await supabase
                .from('pedidos')
                .insert([{
                    customer_name: `${formData.nombre} ${formData.apellido}`,
                    customer_whatsapp: formData.telefono,
                    order_total: totalPrice,
                    payment_status: 'pendiente',
                    weight_grams: pesoTotal,
                    shipping_method: 'domicilio',
                    shipping_address: direccionFinal,
                    cart_items: cartItemsJSON
                }])
                .select().single()

            if (error) throw error

            const orderIdShort = String(pedido.id).toUpperCase()
            
            const nroVentas = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!
            const listaWhatsApp = cart.map(item => 
                `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`
            ).join('\n')
            
            const mensaje = encodeURIComponent(
                `*NUEVO PEDIDO #${orderIdShort} - CONEXIÓN FUNGI*\n\n` +
                `*Cliente:* ${formData.nombre} ${formData.apellido}\n` +
                `*WhatsApp:* ${formData.telefono}\n` +
                `*Entrega:* ${direccionFinal}\n\n` +
                `*PRODUCTOS:*\n${listaWhatsApp}\n\n` +
                `*TOTAL:* $${totalPrice.toLocaleString()}\n\n` +
                `*Envio a convenir*\n\n` +
                `Hola! Ya registré mi pedido. ¿Me pasan los datos para la transferencia?`
            )

            window.open(`https://wa.me/${nroVentas}?text=${mensaje}`, '_blank')
            
            clearCart()
            toast.success("¡Pedido registrado con éxito!")

            sessionStorage.setItem('ultimo_pedido_fungi', orderIdShort)
            window.location.href = `/gracias?order=${orderIdShort}`

        } catch (e: any) {
            console.error(e)
            toast.error("Error al procesar: " + e.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-12 px-[5%]">
            <div className="max-w-6xl mx-auto">
                <Link href="/carrito" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#EF8851] mb-8">
                    <ChevronLeft size={16} /> Volver al carrito
                </Link>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">

                        {/* DATOS PERSONALES */}
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="flex items-center gap-2 font-bold mb-6 text-gray-800 text-xl">
                                <User className="text-[#EF8851]" size={22}/> Tus Datos
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input placeholder="Nombre" className="bg-gray-50 p-4 rounded-2xl" onChange={(e)=>setFormData({...formData, nombre: e.target.value})} />
                                <input placeholder="Apellido" className="bg-gray-50 p-4 rounded-2xl" onChange={(e)=>setFormData({...formData, apellido: e.target.value})} />
                                <input placeholder="WhatsApp (Sin el +)" className="bg-gray-50 p-4 rounded-2xl" onChange={(e)=>setFormData({...formData, telefono: e.target.value})} />
                                <input placeholder="Código Postal" className="bg-gray-50 p-4 rounded-2xl" onChange={(e)=>setFormData({...formData, cpManual: e.target.value})} />
                            </div>
                        </section>

                        {/* ENVÍO */}
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="flex items-center gap-2 font-bold mb-6 text-gray-800 text-xl">
                                <Truck className="text-[#EF8851]" size={22}/> Envío a domicilio
                            </h2>

                            <div className="space-y-4">
                                <input placeholder="Calle y número" className="w-full bg-gray-50 p-4 rounded-2xl"
                                    onChange={(e)=>setFormData({...formData, direccionManual: e.target.value})} 
                                />

                                <input placeholder="Piso / Depto (opcional) Ej: 3B, 2°A" className="w-full bg-gray-50 p-4 rounded-2xl"
                                    onChange={(e)=>setFormData({...formData, pisoDepto: e.target.value})} 
                                />

                                <input placeholder="Localidad" className="w-full bg-gray-50 p-4 rounded-2xl"
                                    onChange={(e)=>setFormData({...formData, localidadManual: e.target.value})} 
                                />

                                <input placeholder="Provincia" className="w-full bg-gray-50 p-4 rounded-2xl"
                                    onChange={(e)=>setFormData({...formData, provincia: e.target.value})} 
                                />
                            </div>
                        </section>

                        <button 
                            onClick={handleFinalizarPedido} 
                            disabled={isSubmitting} 
                            className="w-full bg-[#EF8851] text-white py-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <FontAwesomeIcon icon={faWhatsapp} size="lg" />}
                            {isSubmitting ? "Procesando..." : "Confirmar por WhatsApp"}
                        </button>
                    </div>

                    {/* RESUMEN LATERAL */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-10">
                            <h3 className="font-bold text-xl text-gray-800 mb-6">Resumen</h3>
                            <div className="space-y-4 mb-8">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                                        <span className="font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-6 flex justify-between items-end">
                                <span className="text-lg text-gray-400 font-medium">Total</span>
                                <span className="font-black text-3xl text-gray-900">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}