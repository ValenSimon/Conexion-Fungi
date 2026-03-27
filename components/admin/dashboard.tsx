"use client";
import { useState } from 'react';
import Link from 'next/link';
import Products from "@/public/admin/products.png"
import Orders from "@/public/admin/orders.png"
import Users from "@/public/admin/users.png"
import Logo from "@/public/logos/logo_footer.webp"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    

    return (

        <nav 
            className={`h-screen fixed top-0 left-0 bg-[#EF8851] text-white transition-all duration-300 ease-in-out flex-shrink-0  
            ${isOpen ? 'w-52' : 'w-20'}`}
        >
            <div className="p-4 flex flex-col h-full">
                
                {/* Header del Sidebar: Logo + Botón */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {isOpen && (
                        <img className='w-36' src={Logo.src} alt="" />
                    )}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-md hover:bg-[#c2612d] transition-colors"
                        title={isOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {/* Icono simple de hamburguesa / cerrar */}
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Lista de Navegación */}
                <ul className="space-y-2">
                    <Link href="/admin/productos" className="flex items-center gap-4 p-3 rounded-md hover:bg-[#c2612d] transition-all">
                        <img className='w-6' src={Products.src} alt="" />
                        {isOpen && <span className="font-medium">Productos</span>}
                    </Link>
                    
                    <Link href="/admin/pedidos" className="flex items-center gap-4 p-3 rounded-md hover:bg-[#c2612d] transition-all">
                        <img className='w-6' src={Orders.src} alt="" />
                        {isOpen && <span className="font-medium">Pedidos</span>}
                    </Link>
                    
                    <Link href="/admin/users" className="flex items-center gap-4 p-3 rounded-md hover:bg-[#c2612d] transition-all">
                        <img className='w-6' src={Users.src} alt="" />
                        {isOpen && <span className="font-medium">Usuarios</span>}
                    </Link>
                </ul>

                {/* Footer del Sidebar (Opcional) */}
                {isOpen && (
                    <div className="mt-auto pt-4 border-t border-[#f3a67d] text-xs text-center">
                        v1.0.0
                    </div>
                )}
            </div>
        </nav>
    );
}