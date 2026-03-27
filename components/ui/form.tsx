export default function Form() {
  return (
    <form 
      action="https://formspree.io/f/xdawwjde" 
      method="POST"
      className="flex flex-col px-4 py-4 gap-3 border-1 border-[#BEBEBE] rounded-md shadow-xl"
    >
      <div>
        <h2 className="text-xl font-bold">Envíanos un mensaje</h2>
      </div>

      <div className="lg:flex flex flex-row gap-2 ">
        {/* Nombre Completo */}
        <div className="flex gap-2 lg:w-1/2">
          <label htmlFor="full-name" className="text-sm font-semibold">Nombre Completo</label>
          <input 
            name="name"
            placeholder="Ingresá tu nombre" 
            className="bg-[#FFF9F3] border-1 border-[#FFC789] rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-[#F59F40] user-invalid:border-red-500 user-invalid:ring-1 user-invalid:ring-red-500 transition-colors" 
            type="text" 
            id="full-name" 
            required 
            minLength={3}
            maxLength={50}
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-2 lg:w-1/2">
          <label htmlFor="phone" className="text-sm font-semibold">Teléfono</label>
          <input 
            name="phone" 
            placeholder="Solo números (ej: 1123456789)" 
            className="bg-[#FFF9F3] border-1 border-[#FFC789] rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-[#F59F40] user-invalid:border-red-500 user-invalid:ring-1 user-invalid:ring-red-500 transition-colors" 
            type="text" 
            id="phone" 
            required
            pattern="[0-9]{8,15}" 
            title="Por favor, ingresa un número de teléfono válido (solo números, entre 8 y 15 dígitos)"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input 
          name="email" 
          placeholder="ejemplo@correo.com" 
          className="bg-[#FFF9F3] border-1 border-[#FFC789] rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-[#F59F40] user-invalid:border-red-500 user-invalid:ring-1 user-invalid:ring-red-500 transition-colors" 
          type="email" 
          id="email" 
          required 
        />
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold">Mensaje</label>
        <textarea 
          name="message" 
          placeholder="¿Qué mensaje querés enviar?" 
          className="bg-[#FFF9F3] border-1 border-[#FFC789] rounded-md px-2 py-1 min-h-[100px] md:min-h-[150px] 2xl:min-h-[200px] outline-none focus:ring-1 focus:ring-[#F59F40] user-invalid:border-red-500 user-invalid:ring-1 user-invalid:ring-red-500 transition-colors" 
          id="message" 
          required
          minLength={10}
        ></textarea>
      </div>

      <button 
        className="py-2 bg-[#F59F40] hover:bg-[#e08a2e] active:scale-[0.98] transition-all rounded-md text-white font-semibold cursor-pointer" 
        type="submit"
      >
        Enviar Mensaje
      </button>
      
      {/* Honeypot para evitar spam */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
    </form>
  );
}