'use client'
import { useEffect, useState } from "react"
import { supabase } from "@/src/lib/supabaseClient"
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MessageCircle, 
  Search,
  Trash,
  Home,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

export default function AdminPedidosPage() {
    const [pedidos, setPedidos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState("")

    // 1. Cargar pedidos desde Supabase
    const fetchPedidos = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) {
            toast.error("Error al cargar pedidos")
            console.error(error)
        } else {
            setPedidos(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPedidos()
    }, [])

    /**
     * 2. LÓGICA DE ACTUALIZACIÓN DE ESTADO Y DESCUENTO DE STOCK
     */
    const confirmarPagoYDescontarStock = async (pedido: any) => {
        // Si ya está aprobado, ofrecemos revertir sin tocar stock (por seguridad)
        if (pedido.payment_status === 'aprobado') {
            const revertir = window.confirm("Este pedido ya está aprobado. ¿Deseas marcarlo como pendiente?");
            if (!revertir) return;
            
            const { error } = await supabase
                .from('pedidos')
                .update({ payment_status: 'pendiente' })
                .eq('id', pedido.id);
            
            if (!error) {
                toast.success("Estado revertido a pendiente");
                fetchPedidos();
            }
            return;
        }

        const toastId = toast.loading("Procesando pago y actualizando inventario...");

        try {
            // A. Actualizar el estado del pedido a 'aprobado'
            const { error: errorPedido } = await supabase
                .from('pedidos')
                .update({ payment_status: 'aprobado' })
                .eq('id', pedido.id);

            if (errorPedido) throw new Error("No se pudo actualizar el estado del pedido");

            // B. Procesar el descuento de stock desde el JSONB cart_items
            const items = pedido.cart_items; 
            
            if (items && Array.isArray(items) && items.length > 0) {
                for (const item of items) {
                    // Mapeo flexible de IDs (id, producto_id, productId)
                    const productId = item.id || item.producto_id || item.productId;
                    const cantidadARestar = item.cantidad || item.quantity || 0;

                    if (!productId || cantidadARestar <= 0) continue;

                    // Obtener stock actual de la tabla 'Products'
                    const { data: productData, error: fetchError } = await supabase
                        .from('Products')
                        .select('stock')
                        .eq('id', productId)
                        .single();

                    if (fetchError || !productData) {
                        console.error(`Producto ID ${productId} no encontrado`);
                        continue;
                    }

                    // Actualizar con el nuevo stock
                    const nuevoStock = productData.stock - cantidadARestar;
                    const { error: updateError } = await supabase
                        .from('Products')
                        .update({ stock: nuevoStock })
                        .eq('id', productId);

                    if (updateError) console.error(`Fallo stock ID ${productId}:`, updateError.message);
                }
                toast.success("Pago confirmado y stock actualizado", { id: toastId });
            } else {
                toast.info("Pago confirmado (Sin items para descontar stock)", { id: toastId });
            }

        } catch (error: any) {
            toast.error(error.message || "Error en la operación", { id: toastId });
            console.error(error);
        } finally {
            fetchPedidos();
        }
    }

    // 3. Eliminar pedido
    const eliminarPedido = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que querés eliminar este pedido?")
        if (!confirmar) return

        const { error } = await supabase.from('pedidos').delete().eq('id', id)
        if (error) toast.error("Error al eliminar")
        else {
            toast.success("Pedido eliminado")
            fetchPedidos()
        }
    }

    // 4. Filtro de búsqueda
    const filteredPedidos = pedidos.filter(p => 
        p.customer_name?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.id.toString().includes(filtro)
    )

    return (
        <div className="min-h-screen w-full bg-[#F8F9FA] p-4 md:p-10 text-gray-800">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Pedidos</h1>
                        <p className="text-gray-500 text-sm">Gestión de inventario en tiempo real para Conexión Fungi</p>
                    </div>
                    
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente o ID..." 
                            className="w-full pl-10 pr-4 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#EF8851] outline-none transition-all"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                </header>

                {loading && pedidos.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EF8851]"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredPedidos.map((pedido) => (
                            <div key={pedido.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md animate-in fade-in duration-500">
                                
                                {/* Información del Cliente */}
                                <div className="space-y-2 min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-bold text-xs">
                                            #{pedido.id.toString().slice(-6)}
                                        </span>
                                        <h2 className="text-lg font-bold text-gray-800">{pedido.customer_name}</h2>
                                    </div>
                                    <p className="text-sm text-gray-400 flex items-center gap-1">
                                        <Clock size={14}/> {new Date(pedido.created_at).toLocaleString('es-AR')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            pedido.payment_status === 'aprobado' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {pedido.payment_status}
                                        </span>
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            {pedido.shipping_method === 'pickit' ? <Truck size={12}/> : <Home size={12}/>}
                                            {pedido.shipping_method?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className=" w-60">
                                        <p className="text-sm text-gray-600">
                                            {pedido.shipping_address}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalle del Carrito (JSONB) */}
                                <div className="flex-1 border-l border-gray-50 md:pl-6 bg-gray-50/50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Productos en el pedido</p>
                                    <div className="space-y-1">
                                        {pedido.cart_items?.map((item: any, idx: number) => (
                                            <div key={idx} className="text-sm flex justify-between text-gray-600">
                                                <span>{item.nombre || item.name || `Producto #${item.id}`}</span>
                                                <span className="font-bold">x{item.cantidad || item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xl font-black text-[#EF8851] mt-4">${pedido.order_total?.toLocaleString()}</p>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex flex-row md:flex-col gap-2 justify-center">
                                    <button 
                                        onClick={() => confirmarPagoYDescontarStock(pedido)}
                                        disabled={loading}
                                        className={`flex-1 md:w-44 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                            pedido.payment_status === 'aprobado' 
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                                            : 'bg-gray-900 text-white hover:bg-[#EF8851] hover:shadow-xl hover:shadow-orange-100'
                                        }`}
                                    >
                                        {pedido.payment_status === 'aprobado' ? <CheckCircle2 size={16}/> : <Clock size={16}/>}
                                        {pedido.payment_status === 'aprobado' ? "Pagado" : "Confirmar Pago"}
                                    </button>
                                    
                                    <a 
                                        href={`https://wa.me/${pedido.customer_whatsapp}`} 
                                        target="_blank"
                                        className="flex-1 md:w-44 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                        <MessageCircle size={16}/> WhatsApp
                                    </a>

                                    <button 
                                        onClick={() => eliminarPedido(pedido.id)}
                                        className="flex-1 md:w-44 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                        title="Eliminar pedido"
                                    >
                                        <Trash size={18} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Estado vacío */}
                        {filteredPedidos.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                <AlertCircle className="mx-auto text-gray-200 mb-4" size={48} />
                                <p className="text-gray-400 font-medium">No se encontraron pedidos con ese nombre.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}