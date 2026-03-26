'use client'
import { useState } from 'react'
import { supabase } from "@/src/lib/supabaseClient"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Dentro de tu LoginPage.tsx
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            toast.error("Credenciales incorrectas");
            setLoading(false); // Detenemos el loading si hay error
            return;
        }

        if (data.session) {
            toast.success("Sesión iniciada");
            // Usamos window.location para forzar una recarga total y que el 
            // middleware reconozca la nueva cookie de sesión inmediatamente
            window.location.href = '/admin'; 
        }
    } catch (err) {
        toast.error("Error inesperado");
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full text-[#EF8851]">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Conexión Fungi</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Ingreso exclusivo para administradores</p>
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-[#EF8851] outline-none"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Contraseña" required
            className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-[#EF8851] outline-none"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            disabled={loading}
            className="w-full bg-[#EF8851] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#d97a45] transition-all disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </div>
      </form>
    </div>
  )
}