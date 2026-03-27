'use client'
import { useState, useEffect } from "react"
import { supabase } from "@/src/lib/supabaseClient"
import Plus from "@/public/admin/plus.png"
import Delete from "@/public/admin/delete.png"
import Edit from "@/public/admin/edit.png"
import ModalNuevoProducto from "@/components/admin/modal_nuevo_producto"

interface Producto {
    id: number;
    name: string;
    price: number;
    stock: number;
    image_url: string;
    category_id: number;
    Categories?: { name: string };
}

export default function Productos() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [selectedProductImages, setSelectedProductImages] = useState<{ file: null, preview: string, id: number }[]>([]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Products')
            .select('*, Categories(name)')
            .order('created_at', { ascending: false });

        if (error) console.error("Error:", error.message);
        else setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

        const { error } = await supabase
            .from('Products')
            .delete()
            .eq('id', id);

        if (error) alert("Error al eliminar: " + error.message);
        else fetchProducts();
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setSelectedProductImages([]);
        setIsModalOpen(true);
    };

    const handleEdit = async (product: Producto) => {
        setSelectedProduct(product);
        // Cargar imágenes ANTES de abrir el modal para evitar race conditions
        const { data } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', product.id);
        setSelectedProductImages(
            (data || []).map(img => ({ file: null, preview: img.url, id: img.id }))
        );
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
    setIsModalOpen(false);

    if (selectedProduct) {
        const { data } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', selectedProduct.id);

        setSelectedProductImages(
            (data || []).map(img => ({
                file: null,
                preview: img.url,
                id: img.id
            }))
        );
    }

    setSelectedProduct(null);
    fetchProducts();
};

    return (
        <div className="flex flex-col gap-6 items-center py-6 w-full font-Nunito  mx-auto">
            {/* HEADER SIEMPRE VISIBLE */}
            <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between w-full px-6">
                <h2 className="font-bold text-2xl text-gray-800">Gestión de Productos</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-3 px-6 py-3 bg-[#F59F40] rounded-xl text-white hover:bg-[#c2612d] transition-all shadow-md hover:shadow-lg font-bold"
                >
                    <img className="w-5" src={Plus.src} alt="Plus" />
                    Nuevo Producto
                </button>
            </div>

            <ModalNuevoProducto
                key={selectedProduct?.id ?? 'new'}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productoEditar={selectedProduct}
                initialImages={selectedProductImages}
            />

            <div className="w-full px-4">
                {loading ? (
                    /* ESTADO DE CARGA */
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#EF8851]"></div>
                        <p className="text-gray-400 animate-pulse">Cargando catálogo...</p>
                    </div>
                ) : products.length === 0 ? (
                    /* SIN PRODUCTOS */
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 italic">No hay productos cargados en la base de datos</p>
                    </div>
                ) : (
                    <>
                        {/* VISTA DESKTOP (TABLA) */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Imagen</th>
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4 text-center">Categoría</th>
                                        <th className="px-6 py-4">Precio</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4 text-right pr-10">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                    <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{product.name}</div>
                                                <div className="text-[10px] text-gray-400 font-medium uppercase">ID-{product.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-orange-50 text-[#F59F40] border border-orange-100">
                                                    {product.Categories?.name || 'S/C'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-700">${product.price.toLocaleString('es-AR')}</td>
                                            {product.stock == 0 ? (
                                                <td className="px-6 py-4 text-sm text-red-500 font-black">{product.stock} Unid.</td>
                                            ) : (
                                                <td className="px-6 py-4 text-sm text-gray-500">{product.stock} Unid.</td>
                                            )}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 pr-4">
                                                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100">
                                                        <img src={Edit.src} className="w-5" alt="Edit" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                                        <img src={Delete.src} className="w-5" alt="Delete" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VISTA MOBILE (CARDS) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <img src={product.image_url} className="w-20 h-20 rounded-xl object-cover bg-gray-50" alt="" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 leading-tight">{product.name}</h3>
                                        <p className="text-[#F59F40] font-black">${product.price.toLocaleString('es-AR')}</p>
                                        <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleEdit(product)} className="p-2 bg-gray-50 rounded-lg">
                                            <img src={Edit.src} className="w-5" alt="Edit" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 rounded-lg">
                                            <img src={Delete.src} className="w-5" alt="Delete" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}