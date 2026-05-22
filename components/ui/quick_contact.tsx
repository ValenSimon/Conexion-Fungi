
import telephone from "@/public/contact/telephone.png"
import email from "@/public/contact/email.png"
import instagram from "@/public/contact/instagram.png"

export default function QuickContact() {
    return (
        <div className="flex flex-col gap-3 bg-[#e09c5354] rounded-xl py-4 px-6">
            <div>
                <h2 className="text-xl font-bold">Contacto Rápido</h2>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6">
                    <div className="bg-[#FBFBFB] px-2 py-2 rounded-xl">
                        <img className="w-5" src={telephone.src} alt="" />
                    </div>
                    <div>
                        <p className="font-bold">Teléfono</p>
                        <p className="text-sm">Horario de atención 10am a 8pm</p>
                        <a href="tel:+5491131902313" className="text-[#F59F40]">+5491131902313</a>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-[#FBFBFB] px-2 py-2 rounded-xl">
                        <img className="w-5" src={email.src} alt="" />
                    </div>
                    <div>
                        <p className="font-bold">Email</p>
                        <a href="mailto:[conexionfungi26@gmail.com]" className="text-[#F59F40]">conexionfungi26@gmail.com</a>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-[#FBFBFB] px-2 py-2 rounded-xl">
                        <img className="w-5" src={instagram.src} alt="" />
                    </div>
                    <div>
                        <p className="font-bold">Instagram</p>
                        <a href="https://www.instagram.com/conexion.fungi/" target="_blank" rel="noopener noreferrer" className="text-[#F59F40]">@conexion.fungi</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
