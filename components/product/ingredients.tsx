export default function Ingredients({ ingredients }: { ingredients: any }) {
    
    // 1. Verificamos que existan ingredientes para evitar errores
    if (!ingredients) return null;

    let ingredientsList: string[] = [];

    // 2. Lógica flexible: si es Array lo usamos, si es String lo spliteamos
    if (Array.isArray(ingredients)) {
        ingredientsList = ingredients;
    } else if (typeof ingredients === "string") {
        ingredientsList = ingredients.split(",").map(i => i.trim()).filter(i => i !== "");
    }

    if (ingredientsList.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 bg-[#e09c5351] rounded-xl px-6 py-4 lg:w-1/4">
            <h2 className="w-fit text-xl font-bold font-Nunito border-b-1 border-[#717171] pb-2 sm:text-3xl">
                Ingredientes
            </h2>
            <ul className="list-disc list-inside">
                {ingredientsList.map((ingredient, index) => (
                    <li key={index} className="text-[#575757] font-Nunito sm:text-lg">
                        {ingredient}
                    </li>
                ))}
            </ul>
        </div>
    );
}