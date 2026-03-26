import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import DashBoard from "@/components/admin/dashboard";


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
  title: "Conexion Fungi",
  description: "lorem ipsum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${nunito.variable} antialiased`} >
        <div className="flex gap-6 ml-24">
          <DashBoard />
          {children}
        </div>
      </body>
    </html>
  );
}
