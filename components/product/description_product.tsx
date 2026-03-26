import separator from "@/public/extras/separator.png"


export default function DescriptionProduct({ description }: { description: string }) {
    return (
        <div className="flex flex-col gap-3">
            <div className=" flex items-center gap-2">
                <img className="w-1.5 md:w-2" src={separator.src} alt="separator" />
                <h2 className="text-xl font-bold font-Nunito sm:text-3xl">Descripción del producto</h2>
            </div>
            <div>
                <p className="leading-5 sm:leading-7 ">{description}</p>
            </div>
        </div>
    )
}

