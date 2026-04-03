'use client'

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, MessageCircle, Home } from 'lucide-react';

function GraciasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  // Capturamos el ID de la URL (?order=123456)
  const orderIdUrl = searchParams.get('order');

  useEffect(() => {
    // Validamos contra la sesión local que guardamos en la página anterior
    const orderIdSesion = sessionStorage.getItem('ultimo_pedido_fungi');

    // Si el ID de la URL no existe o no coincide con el de la sesión, bloqueamos acceso
    if (!orderIdUrl || orderIdUrl !== orderIdSesion) {
      const timeout = setTimeout(() => router.push('/catalogo'), 3000);
      setIsAuthorized(false);
      return () => clearTimeout(timeout);
    }

    setIsAuthorized(true);
  }, [orderIdUrl, router]);

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Acceso no válido</h2>
        <p className="text-gray-500 mt-2">No tienes permiso para ver esta orden o la sesión expiró.</p>
        <p className="text-sm text-gray-400 mt-4">Redirigiendo al catálogo...</p>
      </div>
    );
  }

  if (isAuthorized === null) return null;

  return (
    <div className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 p-10 text-center border border-gray-100">
        
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#EF8851] opacity-20 rounded-full animate-ping"></div>
            <div className="relative rounded-full bg-[#EF8851] p-5 shadow-lg shadow-orange-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">¡Pedido Recibido!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Gracias por confiar en <strong>Conexión Fungi</strong>. Tu pedido ya está registrado en nuestro sistema.
        </p>

        <div className="bg-orange-50 rounded-3xl p-6 mb-10 border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <ShoppingBag size={40} className="text-[#EF8851]" />
          </div>
          <p className="text-xs text-[#EF8851] uppercase tracking-[0.2em] font-bold mb-1">Número de identificación</p>
          <p className="text-3xl font-mono font-black text-gray-900">#{orderIdUrl}</p>
        </div>

        <div className="flex items-start gap-3 text-left bg-[#EF8851]/5 p-4 rounded-2xl mb-8 border border-[#EF8851]/10">
          <MessageCircle className="text-[#EF8851] shrink-0" size={20} />
          <p className="text-sm text-gray-900">
            Recuerda que para procesar tu envío debes enviar el <strong>comprobante de transferencia</strong> por WhatsApp al <strong>+54(911)60012600</strong>.
          </p>
        </div>

        <div className="grid gap-3">
          <Link href="/catalogo" className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-[#EF8851] text-white rounded-2xl font-bold hover:bg-[#d97642] transition-all shadow-lg active:scale-[0.98]">
            Seguir explorando
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            <Home size={18} /> Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#EF8851]"></div></div>}>
      <GraciasContent />
    </Suspense>
  );
}