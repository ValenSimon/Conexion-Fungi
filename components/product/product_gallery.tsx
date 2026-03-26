'use client'
import { useState } from 'react'

interface ProductImage {
    id?: number
    url: string
    alt_text?: string | null
}

interface Props {
    product: any
    images: ProductImage[]
}

export default function ProductGallery({ product, images }: Props) {
    // Combinar las imágenes de product_images; si no hay, usar image_url como fallback
    const allImages: ProductImage[] =
        images.length > 0
            ? images
            : [{ url: product.image_url, alt_text: product.name }]

    const [current, setCurrent] = useState(0)

    const prev = () => setCurrent((c) => (c - 1 + allImages.length) % allImages.length)
    const next = () => setCurrent((c) => (c + 1) % allImages.length)

    return (
        <div className="flex flex-col gap-3 w-full select-none">

            {/* Imagen principal con flechas */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-lg group">
                <img
                    key={current}
                    src={allImages[current].url}
                    alt={allImages[current].alt_text ?? product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Flechas (solo si hay más de una imagen) */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            aria-label="Siguiente"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Indicadores de punto */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    i === current
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}