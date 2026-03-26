import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-10 bg-[#EF8851] text-white flex flex-col items-center gap-8">
      {/* Logo */}
      <div className="flex justify-center">
        <img src="/logos/logo_footer.webp" alt="Conexión Fungi Logo" className="h-auto w-auto" />
      </div>

      {/* Navegación Centrada */}
      <nav className="w-full max-w-4xl">
        <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 px-4 text-sm md:text-lg font-medium">
          <li>
            <Link href="/" className="hover:opacity-80 transition-opacity">Inicio</Link>
          </li>
          <li>
            <Link href="/catalogo" className="hover:opacity-80 transition-opacity">Catalogo</Link>
          </li>
          <li>
            <Link href="/servicios" className="hover:opacity-80 transition-opacity">Servicios</Link>
          </li>
          <li>
            <Link href="/contacto" className="hover:opacity-80 transition-opacity">Contacto</Link>
          </li>
          <li>
            <Link href="/sobre-nosotros" className="hover:opacity-80 transition-opacity">Sobre nosotros</Link>
          </li>
        </ul>
      </nav>

      {/* Copyright */}
      <div className="pt-4 border-t border-white/20 w-full text-center">
        <p className="text-xs md:text-sm opacity-90">
          © {new Date().getFullYear()} ConexionFungi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}