import { useWebSocket } from "@/core/presentation/hoooks/useWebsocket";
import ConsumidorState from "@/productores-consumidores/domain/entities/ConsumidorState";
import ProductorState from "@/productores-consumidores/domain/entities/ProductorState";
import { useEffect, useState } from "react";
import { Productores } from "./Productores";
import { Consumidores } from "./Consumidores";
import { useProductorConsumidorApi } from "../hooks/useProductorConsumidorApi";
import Button from "@/core/presentation/components/Button";
import { toast } from "sonner";

export function ProductorConsumidor() {
  const [productoresCount, setProductoresCount] = useState<number>(0);
  const [productores, setProductores] = useState<ProductorState[]>([]);

  const [consumidoresCount, setConsumidoresCount] = useState<number>(0);
  const [consumidores, setConsumidores] = useState<ConsumidorState[]>([]);

  const [bufferSize, setBufferSize] = useState<number>(0);
  const [bufferCapacity, setBufferCapacity] = useState<number>(0);

  const { subscribe, unsubscribe } = useWebSocket();
  const { isSimulationRunning, getState, startSimulation, stopSimulation } =
    useProductorConsumidorApi();

  const buttonClickHandler = () => {
    try {
      if (isSimulationRunning) {
        stopSimulation();
        toast.info("Simulación de productor/consumidor detenida.");
      } else {
        setProductores(
          new Array(productoresCount).fill(ProductorState.DESCANSANDO)
        );
        setConsumidores(
          new Array(consumidoresCount).fill(ConsumidorState.DESCANSANDO)
        );
        startSimulation(5, productoresCount, consumidoresCount);
        toast.info("Simulación de productor/consumidor iniciada.");
      }
    } catch (error) {
      console.error(
        "[Productor/Consumidor]: Error al iniciar/detener la simulación:",
        error
      );

      toast.error(
        "Error al iniciar/detener la simulación de productor/consumidor. Por favor, intente nuevamente."
      );
    }
  };

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const {
          isRunning,
          productoresCount: _productoresCount,
          consumidoresCount: _consumidoresCount,
          bufferSize: _bufferSize,
          bufferCapacity: _bufferCapacity,
        } = await getState();

        const newProductoresCount = isRunning
          ? _productoresCount
          : productoresCount;
        setProductoresCount(newProductoresCount);
        setProductores(
          new Array(newProductoresCount).fill(ProductorState.DESCANSANDO)
        );

        const newConsumidoresCount = isRunning
          ? _consumidoresCount
          : consumidoresCount;
        setConsumidoresCount(newConsumidoresCount);
        setConsumidores(
          new Array(newConsumidoresCount).fill(ConsumidorState.DESCANSANDO)
        );

        if (isRunning) {
          setBufferSize(_bufferSize);
          setBufferCapacity(_bufferCapacity);

          toast.info(
            "Simulación de productor/consumidor en curso recuperada al cargar la página."
          );
        }
      } catch (error) {
        console.error(
          "[Productor/Consumidor]: Error al consultar el estado inicial:",
          error
        );

        toast.error("Error al consultar el estado inicial de la simulación.");
      }
    };

    fetchInitialState();
  }, [getState]);

  useEffect(() => {
    const key = "PRODUCTOR_CONSUMIDOR";
    subscribe(key, (msg) => {
      const { action, data: dataStr } = msg;
      const data = JSON.parse(dataStr);
      const { id, estado } = data;

      switch (action) {
        case "UPDATE_PRODUCTOR":
          setProductores((prevProductores) => {
            if (!prevProductores) return prevProductores;
            const newProductores = [...prevProductores];
            newProductores[id] = estado as ProductorState;
            return newProductores;
          });
          break;

        case "UPDATE_CONSUMIDOR":
          setConsumidores((prevConsumidores) => {
            if (!prevConsumidores) return prevConsumidores;
            const newConsumidores = [...prevConsumidores];
            newConsumidores[id] = estado as ConsumidorState;
            return newConsumidores;
          });
          break;

        case "UPDATE_BUFFER":
          const { size, capacity } = data;
          setBufferCapacity(capacity);
          setBufferSize(size);
          break;
      }
    });

    return () => {
      unsubscribe(key);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-y-4">
      <h2>Productores</h2>

      <aside className="flex items-center gap-x-2 text-black">
        <button
          className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setProductoresCount((prev) => prev - 1)}
          disabled={isSimulationRunning || productoresCount <= 1}
        >
          ◀
        </button>
        <p className="h-8 bg-white rounded border border-gray-600 px-8">
          {productoresCount}
        </p>
        <button
          className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setProductoresCount((prev) => prev + 1)}
          disabled={isSimulationRunning || productoresCount >= 10}
        >
          ▶
        </button>
      </aside>

      <Productores productores={productores} />

      <aside className="flex items-center justify-center">
        {new Array(bufferCapacity).fill(null).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded border border-gray-100 ${
              index < bufferSize ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </aside>

      <Button onClick={buttonClickHandler}>
        {isSimulationRunning ? "Detener" : "Iniciar"}
      </Button>

      <Consumidores consumidores={consumidores} />

      <aside className="flex items-center gap-x-2 text-black">
        <button
          className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setConsumidoresCount((prev) => prev - 1)}
          disabled={isSimulationRunning || consumidoresCount <= 1}
        >
          ◀
        </button>
        <p className="h-8 bg-white rounded border border-gray-600 px-8">
          {consumidoresCount}
        </p>
        <button
          className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setConsumidoresCount((prev) => prev + 1)}
          disabled={isSimulationRunning || consumidoresCount >= 10}
        >
          ▶
        </button>
      </aside>

      <h2>Consumidores</h2>
    </section>
  );
}
