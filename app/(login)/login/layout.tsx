import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext"; // Asegúrate de crear este archivo
import { Toaster } from 'sonner'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-Nunito",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conexión Fungi | Bienestar Natural",
  description: "Tu tienda de productos naturales basados en hongos y bienestar holístico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${nunito.variable} antialiased`}>
        {/* Envolvemos con el Provider del Carrito */}
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}