'use client'
import Link from 'next/link'
import cart_icon from '@/public/cart/cart_icon.png'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export function Navbar() {
    const { cart } = useCart()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Función para cerrar el menú al hacer click en un link
    const closeMenu = () => setIsMenuOpen(false)

    return (
        <nav className="bg-[#EF8851] py-4 px-[5%] h-[15vh] flex justify-between items-center md:h-[10vh] relative z-50">
            {/* Logo */}
            <div>
                <Link href="/">
                    <img className="w-32 2xl:w-40" src="/logos/logo.webp" alt="Logo" />
                </Link>
            </div>

            {/* Iconos Derecha (Mobile) */}
            <div className="flex items-center gap-4 md:hidden">
                {/* Carrito en mobile para que sea accesible */}
                <Link href="/carrito">
                    <div className='relative'>
                        <img className='w-7' src={cart_icon.src} alt="Carrito" />
                        <p className='text-[10px] absolute -top-2 -right-2 bg-white text-[#EF8851] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                        </p>
                    </div>
                </Link>
                
                {/* Botón Hamburguesa */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <img src="/extras/menuburguer.png" alt="Menu" className="w-8" />
                </button>
            </div>

            {/* Menú Desktop */}
            <div className="text-[#ffff] hidden md:block">
                <ul className="flex gap-6 md:text-lg">
                    <Link className='hover:text-[#fabb79] transition-all' href="/"><li>Inicio</li></Link>
                    <Link className='hover:text-[#fabb79] transition-all' href="/catalogo"><li>Catálogo</li></Link>
                    <Link className='hover:text-[#fabb79] transition-all' href="/servicios"><li>Servicios</li></Link>
                    <Link className='hover:text-[#fabb79] transition-all' href="/sobre-nosotros"><li>Sobre Nosotros</li></Link>
                    <Link className='hover:text-[#fabb79] transition-all' href="/contacto"><li>Contacto</li></Link>
                </ul>
            </div>

            {/* Carrito Desktop */}
            <div className='hidden md:block'>
                <Link href="/carrito">
                    <div className='relative'>
                        <img className='w-8' src={cart_icon.src} alt="" />
                        <p className='text-sm absolute bottom-7 left-6 bg-white rounded-full w-6 h-6 flex items-center justify-center'>
                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                        </p>
                    </div>
                </Link>
            </div>

            {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
            <div className={`fixed inset-0 bg-[#EF8851] z-[60] flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                {/* Botón Cerrar */}
                <button 
                    className="absolute top-10 right-10 text-white text-4 academic-bold"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <span className="text-3xl">✕</span>
                </button>

                <ul className="flex flex-col gap-8 text-white text-2xl text-center">
                    <Link onClick={closeMenu} href="/"><li>Inicio</li></Link>
                    <Link onClick={closeMenu} href="/catalogo"><li>Catálogo</li></Link>
                    <Link onClick={closeMenu} href="/servicios"><li>Servicios</li></Link>
                    <Link onClick={closeMenu} href="/sobre-nosotros"><li>Sobre Nosotros</li></Link>
                    <Link onClick={closeMenu} href="/contacto"><li>Contacto</li></Link>
                </ul>
            </div>
        </nav>
    )
}