import ConsumidorState from "@/productores-consumidores/domain/entities/ConsumidorState";

interface ConsumidoresProps {
  consumidores: ConsumidorState[];
  size?: number;
}

export function Consumidores({ consumidores, size = 64 }: ConsumidoresProps) {
  return (
    <div className={`flex gap-2`}>
      {consumidores.map((consumidor, index) => (
        <div
          key={index}
          className={`rounded-full border border-white flex items-center justify-center text-4xl ${
            consumidor === ConsumidorState.DESCANSANDO
              ? "bg-gray-500"
              : consumidor === ConsumidorState.CONSUMIENDO
              ? "bg-green-700"
              : "bg-red-800"
          }`}
          style={{ width: size, height: size }}
        >
          {consumidor === ConsumidorState.DESCANSANDO
            ? "😴"
            : consumidor === ConsumidorState.CONSUMIENDO
            ? "🏃‍♀️"
            : "⌛"}
        </div>
      ))}
    </div>
  );
}
