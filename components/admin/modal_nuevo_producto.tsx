'use client'
import { useState, useEffect } from 'react'
import { supabase } from "@/src/lib/supabaseClient"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productoEditar?: any | null;
    initialImages?: { file: null; preview: string; id: number }[];
}

interface ProductImage {
    file: File | null;
    preview: string;
    id?: number;
}

export default function ModalProducto({ isOpen, onClose, productoEditar, initialImages = [] }: Props) {
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState<any[]>([])
    const [images, setImages] = useState<ProductImage[]>(initialImages)
    const [isFeatured, setIsFeatured] = useState(productoEditar?.is_featured || false)
    const router = useRouter()

    // Cargar categorías
    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase.from('Categories').select('*');
            setCategorias(data || []);
        };
        if (isOpen) fetchCats();
    }, [isOpen]);

    // Sincronizar imágenes al abrir
    useEffect(() => {
        if (isOpen) {
            setImages(initialImages);
            setIsFeatured(productoEditar?.is_featured || false);
        }
    }, [isOpen, productoEditar?.id]);

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

            setImages(prev => [...prev, ...newImages]);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const imageToRemove = prev[index];

            if (imageToRemove.preview.startsWith('blob:')) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (images.length === 0) return toast.error("Sube al menos una imagen");

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        let productId = productoEditar?.id;

        try {
            // 🔥 PROCESAR IMÁGENES (FIX DUPLICADOS)
            let firstImageUrl = '';
            const newImageUrls: string[] = [];
            const existingImages: { id?: number; url: string }[] = [];

            for (const img of images) {
                if (img.file) {
                    // NUEVA → subir
                    const fileExt = img.file.name.split('.').pop();
                    const fileName = `${productId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('producto-imagenes')
                        .upload(fileName, img.file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('producto-imagenes')
                        .getPublicUrl(fileName);

                    newImageUrls.push(urlData.publicUrl);
                    if (!firstImageUrl) firstImageUrl = urlData.publicUrl;

                } else {
                    // EXISTENTE → NO duplicar
                    existingImages.push({ id: img.id, url: img.preview });
                    if (!firstImageUrl) firstImageUrl = img.preview;
                }
            }

            const productData = {
                name: formData.get('nombre')?.toString(),
                short_description: formData.get('short_description')?.toString(),
                description: formData.get('description')?.toString(),
                price: parseFloat(formData.get('precio') as string) || 0,
                stock: parseInt(formData.get('stock') as string) || 0,
                weight_grams: parseInt(formData.get('weight') as string) || 0,
                category_id: Number(formData.get('category_id')),
                is_featured: Boolean(isFeatured),
                image_url: firstImageUrl,
            };

            // INSERT o UPDATE
            if (productId) {
                const { error } = await supabase
                    .from('Products')
                    .update(productData)
                    .eq('id', Number(productId));

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('Products')
                    .insert([productData])
                    .select()
                    .single();

                if (error) throw error;
                productId = data.id;
            }

            // 🔥 GALERÍA
            if (productoEditar) {
                // 🔥 IDs actuales
                const remainingIds = images
                    .filter(img => img.id !== undefined)
                    .map(img => Number(img.id));

                // 🔥 IDs eliminados
                    const removedIds = initialImages
                    .filter(orig => orig.id && !remainingIds.includes(Number(orig.id)))
                    .map(orig => Number(orig.id));

                // ❌ BORRAR DE DB
                if (removedIds.length > 0) {
                        const { error } = await supabase
                        .from('product_images')
                        .delete()
                        .in('id', removedIds);

                    if (error) throw error;
                }

                // 🔥 INSERTAR NUEVAS (ESTO TE FALTABA)
                if (newImageUrls.length > 0) {
                    const { error } = await supabase
                        .from('product_images')
                        .insert(
                            newImageUrls.map(url => ({
                    product_id: productId,
                    url,
                    alt_text: productData.name
                }))
            );

                    if (error) throw error;
                }
            } else {
                // Producto nuevo
                const allUrls = [...existingImages.map(i => i.url), ...newImageUrls];

                if (allUrls.length > 0) {
                    const imagesToInsert = allUrls.map(url => ({
                        product_id: Number(productId),
                        url: url,
                        alt_text: productData.name
                    }));

                    const { error } = await supabase.from('product_images').insert(imagesToInsert);
                    if (error) throw error;
                }
            }

            toast.success(productoEditar ? "¡Producto actualizado!" : "¡Producto creado!");
            onClose();
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error("Error: " + (error.message || "No se pudo guardar"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 text-slate-800">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[95vh] scrollbar-hide">

                <button onClick={onClose} type="button" className="absolute top-6 right-6 text-gray-400 p-2 hover:text-gray-600 transition-colors">
                    ✕
                </button>

                <h2 className="text-2xl font-black text-[#EF9B51] uppercase mb-6 tracking-tighter">
                    {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* IMÁGENES */}
                    <div className="grid grid-cols-2 gap-3">
                        {images.map((img, index) => (
                            <div key={img.id ?? img.preview} className="group relative h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full shadow-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {images.length < 4 && (
                            <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
                                <span className="text-xl">📸</span>
                                <p className="text-[9px] font-bold text-gray-400 mt-1">
                                    Agregar Foto ({images.length}/4)
                                </p>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                        )}
                    </div>

                    {/* FORM */}
                    <div className="space-y-3">
                        <select name="category_id" defaultValue={productoEditar?.category_id} className="w-full bg-gray-50 p-3 rounded-2xl" required>
                            <option value="">Seleccionar Categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <input name="nombre" defaultValue={productoEditar?.name} placeholder="Nombre" className="w-full bg-gray-50 p-3 rounded-2xl" required />

                        <div className="grid grid-cols-3 gap-2">
                            <input name="precio" type="number" defaultValue={productoEditar?.price} placeholder="Precio" className="bg-gray-50 p-3 rounded-2xl" required />
                            <input name="stock" type="number" defaultValue={productoEditar?.stock} placeholder="Stock" className="bg-gray-50 p-3 rounded-2xl" required />
                            <input name="weight" type="number" defaultValue={productoEditar?.weight_grams} placeholder="Peso" className="bg-gray-50 p-3 rounded-2xl" required />
                        </div>

                        <input name="short_description" defaultValue={productoEditar?.short_description} placeholder="Descripción corta" className="w-full bg-gray-50 p-3 rounded-2xl" required />

                        <div className="flex items-center gap-3">
                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                            <label>Producto destacado</label>
                        </div>

                        <textarea name="description" defaultValue={productoEditar?.description} rows={3} className="w-full bg-gray-50 p-3 rounded-2xl" required />
                    </div>

                    <button disabled={loading} className="w-full bg-[#EF9B51] py-4 rounded-2xl text-white font-black">
                        {loading ? 'PROCESANDO...' : 'GUARDAR'}
                    </button>
                </form>
            </div>
        </div>
    )
}