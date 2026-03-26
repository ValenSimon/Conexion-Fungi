'use client'
import { useState, useEffect } from 'react'
import { supabase } from "@/src/lib/supabaseClient"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productoEditar?: any | null;
}

interface ProductImage {
    file: File | null;
    preview: string;
    id?: number;
}

export default function ModalProducto({ isOpen, onClose, productoEditar }: Props) {
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState<any[]>([])
    const [images, setImages] = useState<ProductImage[]>([])
    const [isFeatured, setIsFeatured] = useState(false)
    const router = useRouter()

    // 1. Cargar categorías al abrir
    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase.from('Categories').select('*');
            setCategorias(data || []);
        };
        if (isOpen) fetchCats();
    }, [isOpen]);

    // 2. Cargar datos del producto si estamos editando
    useEffect(() => {
        if (productoEditar && isOpen) {
            const fetchImages = async () => {
                const { data } = await supabase
                    .from('product_images')
                    .select('*')
                    .eq('product_id', productoEditar.id);
                
                if (data) {
                    setImages(data.map(img => ({ file: null, preview: img.url, id: img.id })));
                }
            };
            fetchImages();
            setIsFeatured(productoEditar.is_featured || false);
        } else {
            setImages([]);
            setIsFeatured(false);
        }
    }, [productoEditar, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (images.length + newFiles.length > 4) {
                return toast.error("Máximo 4 imágenes por producto");
            }

            const newImages = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (images.length === 0) return toast.error("Sube al menos una imagen");

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        let productId = productoEditar?.id;

        try {
            // --- PASO 1: PROCESAR IMÁGENES ---
            let firstImageUrl = '';
            const finalImageUrls: string[] = [];

            for (const img of images) {
                if (img.file) {
                    const fileExt = img.file.name.split('.').pop();
                    const fileName = `${productId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    
                    const { error: uploadError } = await supabase.storage
                        .from('producto-imagenes')
                        .upload(fileName, img.file);
                    
                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('producto-imagenes')
                        .getPublicUrl(fileName);
                    
                    finalImageUrls.push(urlData.publicUrl);
                    if (!firstImageUrl) firstImageUrl = urlData.publicUrl;
                } else {
                    finalImageUrls.push(img.preview);
                    if (!firstImageUrl) firstImageUrl = img.preview;
                }
            }

            // --- PASO 2: OBJETO DE DATOS (SIN INGREDIENTES) ---
            const productData = {
                name: formData.get('nombre')?.toString(),
                short_description: formData.get('short_description')?.toString(),
                description: formData.get('description')?.toString(),
                price: parseFloat(formData.get('precio') as string) || 0,
                stock: parseInt(formData.get('stock') as string) || 0,
                weight_grams: parseInt(formData.get('weight') as string) || 0,
                category_id: Number(formData.get('category_id')), // int8
                is_featured: Boolean(isFeatured),
                image_url: firstImageUrl,
            };

            // --- PASO 3: UPDATE O INSERT EN PRODUCTS ---
            if (productId) {
                const { error: updateError } = await supabase
                    .from('Products')
                    .update(productData)
                    .eq('id', Number(productId)); // int8
                
                if (updateError) throw updateError;
            } else {
                const { data, error: insertError } = await supabase
                    .from('Products')
                    .insert([productData])
                    .select()
                    .single();
                
                if (insertError) throw insertError;
                productId = data.id;
            }

            // --- PASO 4: ACTUALIZAR GALERÍA (product_images) ---
            await supabase.from('product_images').delete().eq('product_id', Number(productId));

            const imagesToInsert = finalImageUrls.map(url => ({
                product_id: Number(productId),
                url: url,
                alt_text: productData.name
            }));

            const { error: imgError } = await supabase.from('product_images').insert(imagesToInsert);
            if (imgError) throw imgError;

            toast.success(productoEditar ? "¡Producto actualizado!" : "¡Producto creado!");
            onClose();
            
            // Refresca los datos sin recargar toda la página (mejor UX)
            router.refresh(); 
            // Si prefieres la recarga total: window.location.reload();

        } catch (error: any) {
            console.error("Error completo:", error);
            toast.error("Error: " + (error.message || "No se pudo guardar"));
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 text-slate-800">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[95vh] scrollbar-hide">
                
                <button onClick={onClose} type="button" className="absolute top-6 right-6 text-gray-400 p-2 hover:text-gray-600 transition-colors">✕</button>

                <h2 className="text-2xl font-black text-[#EF9B51] uppercase mb-6 tracking-tighter">
                    {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Galería */}
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full">✕</button>
                            </div>
                        ))}
                        
                        {images.length < 4 && (
                            <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <span className="text-xl">📸</span>
                                <p className="text-[8px] font-bold uppercase">Agregar Foto ({images.length}/4)</p>
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <select name="category_id" defaultValue={productoEditar?.category_id} className="w-full bg-gray-50 p-3 rounded-2xl outline-none border-2 border-transparent focus:border-[#EF9B51] transition-all" required>
                            <option value="">Seleccionar Categoría</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        
                        <input name="nombre" defaultValue={productoEditar?.name} placeholder="Nombre del producto" className="w-full bg-gray-50 p-3 rounded-2xl outline-none focus:border-[#EF9B51] border-2 border-transparent" required />

                        <div className="grid grid-cols-3 gap-2">
                            <input name="precio" type="number" step="0.01" defaultValue={productoEditar?.price} placeholder="Precio" className="bg-gray-50 p-3 rounded-2xl outline-none focus:border-[#EF9B51] border-2 border-transparent" required />
                            <input name="stock" type="number" defaultValue={productoEditar?.stock} placeholder="Stock" className="bg-gray-50 p-3 rounded-2xl outline-none focus:border-[#EF9B51] border-2 border-transparent" required />
                            <input name="weight" type="number" defaultValue={productoEditar?.weight_grams} placeholder="Peso (g)" className="bg-gray-50 p-3 rounded-2xl outline-none focus:border-[#EF9B51] border-2 border-transparent" required />
                        </div>

                        <input name="short_description" defaultValue={productoEditar?.short_description} placeholder="Descripción corta" className="w-full bg-gray-50 p-3 rounded-2xl outline-none focus:border-[#EF9B51] border-2 border-transparent" required />

                        <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-2xl border border-orange-100">
                            <input type="checkbox" id="is_featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 accent-[#EF9B51] cursor-pointer" />
                            <label htmlFor="is_featured" className="text-sm font-bold text-gray-600 cursor-pointer">¿Producto Destacado?</label>
                        </div>
                        
                        <textarea name="description" defaultValue={productoEditar?.description} rows={3} className="w-full bg-gray-50 p-3 rounded-2xl outline-none resize-none focus:border-[#EF9B51] border-2 border-transparent" placeholder="Descripción detallada" required />
                    </div>

                    <button disabled={loading} className="w-full bg-[#EF9B51] py-4 rounded-2xl text-white font-black shadow-xl disabled:opacity-50 hover:bg-[#d98a44] transition-all active:scale-95">
                        {loading ? 'PROCESANDO...' : (productoEditar ? 'GUARDAR CAMBIOS' : 'PUBLICAR PRODUCTO')}
                    </button>
                </form>
            </div>
        </div>
    )
}