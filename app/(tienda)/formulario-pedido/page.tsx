'use client'
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ChevronLeft, MapPin } from "lucide-react"
import { supabase } from "@/src/lib/supabaseClient"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function FinalizarCompraPage() {
    const { cart, totalPrice, clearCart } = useCart()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoadingGeo, setIsLoadingGeo] = useState(false)

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccionManual: '',
        pisoDepto: '', 
        localidadManual: '',
        provincia: '', 
        cpManual: '',
    })

    const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

    useEffect(() => {
        const buscarDireccion = async () => {
            if (formData.direccionManual.length < 5) {
                setSuggestions([]);
                return;
            }
            setIsLoadingGeo(true);
            try {
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(formData.direccionManual)}&filter=countrycode:ar&lang=es&limit=5&apiKey=${API_KEY}`;
                const res = await fetch(url);
                const data = await res.json();
                setSuggestions(data.features || []);
            } catch (error) {
                console.error("Error Geoapify:", error);
            } finally {
                setIsLoadingGeo(false);
            }
        };
        const timeoutId = setTimeout(buscarDireccion, 600);
        return () => clearTimeout(timeoutId);
    }, [formData.direccionManual, API_KEY]);

    const seleccionarDireccion = (item) => {
        const props = item.properties;
        setFormData({
            ...formData,
            direccionManual: props.address_line1 || "", 
            localidadManual: props.city || props.village || props.suburb || props.town || "",
            provincia: props.state || "",
            cpManual: props.postcode || formData.cpManual
        });
        setShowSuggestions(false);
    };

    const handleFinalizarPedido = async () => {
        if (!formData.nombre || !formData.telefono || !formData.cpManual) {
            return toast.error("Completa tus datos personales.")
        }
        if (!formData.direccionManual || !formData.localidadManual) {
            return toast.error("Ingresa una dirección válida.")
        }

        setIsSubmitting(true)
        try {
            const direccionFinal = `${formData.direccionManual}${formData.pisoDepto ? `, ${formData.pisoDepto}` : ''}, ${formData.localidadManual}, ${formData.provincia} (CP: ${formData.cpManual})`;
            
            // 1. GUARDAR EN SUPABASE USANDO TUS COLUMNAS REALES
            const { data: orderData, error } = await supabase
                .from('pedidos')
                .insert([{
                    customer_name: formData.nombre,
                    customer_whatsapp: formData.telefono,
                    shipping_address: direccionFinal,
                    order_total: totalPrice,
                    cart_items: cart, // Tu columna es jsonb
                    payment_status: 'pendiente' 
                }])
                .select()
                .single();

            if (error) throw error;

            const orderId = orderData.id;

            // 2. PREPARAR WHATSAPP
            const productosTexto = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
            const mensaje = `*Nuevo Pedido #${orderId} - Conexión Fungi*\n\n` +
                `*Datos del Cliente:*\n` +
                `Cliente: ${formData.nombre}\n` +
                `*Dirección de Envío:*\n` +
                `${direccionFinal}\n\n` +
                `*Productos:*\n` +
                `${productosTexto}\n\n` +
                `*Total: $${totalPrice.toLocaleString('es-AR')}*\n\n` +
                `Hola! Ya registré mi pedido #${orderId}. ¿Me pasan los datos para la transferencia?`;

            const numeroWhatsApp = "5491160012600";
            const wpUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

            // 3. SESIÓN Y REDIRECCIÓN
            // Importante: Guardar como string
            sessionStorage.setItem('ultimo_pedido_fungi', String(orderId));
            
            window.open(wpUrl, '_blank');
            
            clearCart();
            router.push(`/gracias?order=${orderId}`);

        } catch (e) {
            console.error("Error completo:", e);
            toast.error("Error en la base de datos: " + e.message);
        } finally {
            setIsSubmitting(false)
        }
    }

    if (cart.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-12 px-[5%]">
            <div className="max-w-6xl mx-auto">
                <Link href="/carrito" className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <ChevronLeft size={16} /> Volver
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="font-bold mb-6 text-xl">Tus Datos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input placeholder="Nombre y Apellido" className="bg-gray-50 p-4 rounded-2xl outline-none" value={formData.nombre} onChange={(e)=>setFormData({...formData, nombre: e.target.value})} />
                                <input placeholder="WhatsApp" className="bg-gray-50 p-4 rounded-2xl outline-none" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono: e.target.value})} />
                                <input placeholder="Código Postal" className="bg-gray-50 p-4 rounded-2xl outline-none" value={formData.cpManual} onChange={(e)=>setFormData({...formData, cpManual: e.target.value})} />
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-visible">
                            <h2 className="font-bold mb-6 text-xl">Envío</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        placeholder="Calle y número..." 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#EF8851]"
                                        value={formData.direccionManual}
                                        onFocus={() => setShowSuggestions(true)}
                                        autoComplete="off"
                                        onChange={(e)=>setFormData({...formData, direccionManual: e.target.value})} 
                                    />
                                    {isLoadingGeo && <Loader2 className="absolute right-4 top-4 animate-spin text-[#EF8851]" size={20}/>}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-50 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                                            {suggestions.map((item, index) => (
                                                <button key={index} type="button" onClick={() => seleccionarDireccion(item)} className="w-full text-left p-4 hover:bg-orange-50 border-b last:border-none flex items-start gap-3">
                                                    <MapPin className="text-gray-400 mt-1" size={16} />
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.properties.address_line1}</p>
                                                        <p className="text-gray-500 text-xs">{item.properties.city || 'Ver detalle'}, {item.properties.state}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input placeholder="Piso/Depto" className="bg-gray-50 p-4 rounded-2xl outline-none" value={formData.pisoDepto} onChange={(e)=>setFormData({...formData, pisoDepto: e.target.value})} />
                                    <input placeholder="Localidad" value={formData.localidadManual} readOnly className="bg-gray-100 p-4 rounded-2xl text-gray-500 cursor-not-allowed" />
                                    <input placeholder="Provincia" value={formData.provincia} readOnly className="bg-gray-100 p-4 rounded-2xl text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>
                        </section>

                        <button onClick={handleFinalizarPedido} disabled={isSubmitting} className="w-full bg-[#EF8851] text-white py-6 rounded-3xl font-bold text-xl shadow-lg flex items-center justify-center gap-3">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><FontAwesomeIcon icon={faWhatsapp} className="text-2xl" /> Confirmar por WhatsApp</>}
                        </button>
                    </div>
                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
                            <h2 className="font-bold text-xl mb-5">Resumen del pedido</h2>
                            <div className="space-y-4 divide-y divide-gray-100">
                                {cart.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 pt-4 first:pt-0">
                                        {item.image_url && (
                                            <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-gray-800 whitespace-nowrap">
                                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Total</span>
                                <span className="text-xl font-bold text-[#EF8851]">${totalPrice.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}