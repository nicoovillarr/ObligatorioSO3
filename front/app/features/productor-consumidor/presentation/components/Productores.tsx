import ProductorState from "@/productores-consumidores/domain/entities/ProductorState";

interface ProductoresProps {
  productores: ProductorState[];
  size?: number;
}

export function Productores({ productores, size = 64 }: ProductoresProps) {
  return (
    <div className={`flex gap-2`}>
      {productores.map((productor, index) => (
        <div
          key={index}
          className={`rounded-full border border-white flex items-center justify-center text-4xl ${
            productor === ProductorState.DESCANSANDO
              ? "bg-gray-500"
              : productor === ProductorState.PRODUCIENDO
              ? "bg-green-700"
              : "bg-red-800"
          }`}
          style={{ width: size, height: size }}
        >
          {productor === ProductorState.DESCANSANDO
            ? "😴"
            : productor === ProductorState.PRODUCIENDO
            ? "🛠️"
            : "⌛"}
        </div>
      ))}
    </div>
  );
}
