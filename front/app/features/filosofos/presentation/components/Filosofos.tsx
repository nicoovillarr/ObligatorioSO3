import { useEffect, useRef, useState } from "react";
import Mesa from "./CircleRing";
import FilosofoState from "../../domain/entities/FilosofoState";
import Button from "@/core/presentation/components/Button";
import { useFilosofosApi } from "../hooks/useFilosofosApi";
import { useWebSocket } from "@/core/presentation/hoooks/useWebsocket";
import { toast } from "sonner";

export default function Filosofos() {
  const { isSimulationRunning, getState, startSimulation, stopSimulation } =
    useFilosofosApi();

  const sectionRef = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState<number>(0);
  const [count, setCount] = useState<number>(5);
  const [filosofos, setFilosofos] = useState<FilosofoState[]>([]);

  const { subscribe, unsubscribe } = useWebSocket();

  const buttonClickHandler = () => {
    try {
      if (isSimulationRunning) {
        stopSimulation();
        toast.info("Simulación de filósofos detenida.");
      } else {
        setFilosofos(new Array(count).fill(FilosofoState.PENSANDO));
        startSimulation(count);
        toast.info("Simulación de filósofos iniciada.");
      }
    } catch (error) {
      console.error(
        "[Filósofos]: Error al iniciar/detener la simulación:",
        error
      );

      toast.error(
        "Error al iniciar/detener la simulación de filósofos. Por favor, intente nuevamente."
      );
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setSize(width);
      }
    });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    const key = "ESTADO_FILOSOFO";
    subscribe(key, (msg) => {
      const { data: dataStr } = msg;
      const data = JSON.parse(dataStr);
      const { id, estado } = data;
      setFilosofos((prevFilosofos) => {
        const newState: FilosofoState = estado as FilosofoState;

        const newFilosofos = [...prevFilosofos];
        newFilosofos[id] = newState;

        return newFilosofos;
      });

      console.log(`[Filósofos]: Filósofo ${id} cambió a estado ${estado}`);
    });

    return () => {
      unsubscribe(key);
    };
  }, []);

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const { isRunning, filosofosCount } = await getState();

        setFilosofos(
          new Array(isRunning ? filosofosCount : count).fill(
            FilosofoState.PENSANDO
          )
        );

        if (isRunning) {
          setCount(filosofosCount);
          toast.info(
            "Simulación de filósofos en curso recuperada al cargar la página."
          );
        }
      } catch (error) {
        console.error(
          "[Filósofos]: Error al consultar el estado inicial:",
          error
        );

        toast.error("Error al consultar el estado inicial de la simulación.");
      }
    };

    fetchInitialState();
  }, [getState]);

  return (
    <section
      ref={sectionRef}
      className="relative aspect-square w-full sm:w-lg md:w-2xl lg:w-4xl mx-auto"
    >
      <Mesa filosofos={filosofos} height={size} width={size} />

      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-y-4">
        <aside className="flex items-center gap-x-2 text-black">
          <button
            className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCount((prev) => prev - 1)}
            disabled={isSimulationRunning || count <= 1}
          >
            ◀
          </button>
          <p className="h-8 bg-white rounded border border-gray-600 px-8">
            {count}
          </p>
          <button
            className="w-8 h-8 bg-white rounded border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCount((prev) => prev + 1)}
            disabled={isSimulationRunning || count >= 10}
          >
            ▶
          </button>
        </aside>
        <Button onClick={buttonClickHandler}>
          {isSimulationRunning ? "Detener" : "Iniciar"}
        </Button>
      </section>
    </section>
  );
}
