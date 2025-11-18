import { API_BASE_URL } from "app/libs/constants";
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

const FILOSOFOS_API_URL = `${API_BASE_URL}/filosofos`;

interface IFilosofosApiContext {
  isSimulationRunning: boolean;
  getState: () => Promise<{ isRunning: boolean; filosofosCount: number }>;
  startSimulation: (filosofos: number) => void;
  stopSimulation: () => void;
}

export const FilosofosApiContext = createContext<IFilosofosApiContext | null>(
  null
);

export function FilosofosApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const startSimulation = useCallback(async (filosofos: number) => {
    const response = await fetch(`${FILOSOFOS_API_URL}/iniciar`, {
      method: "POST",
      body: JSON.stringify({ filosofos }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("[Filósofos]: Error al iniciar la simulación");
    }

    setIsSimulationRunning(true);
    console.log("[Filósofos]: Iniciando simulación...");
  }, []);

  const stopSimulation = useCallback(async () => {
    const response = await fetch(`${FILOSOFOS_API_URL}/detener`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("[Filósofos]: Error al detener la simulación");
    }

    setIsSimulationRunning(false);
    console.log("[Filósofos]: Deteniendo simulación...");
  }, []);

  const getState = useCallback(async () => {
    const response = await fetch(`${FILOSOFOS_API_URL}/estado`);
    if (!response.ok) {
      throw new Error(
        "[Filósofos]: Error al consultar el estado de la simulación"
      );
    }

    const data = await response.json();
    const { isRunning, filosofosCount } = data;

    setIsSimulationRunning(isRunning);

    return { isRunning, filosofosCount };
  }, []);

  return (
    <FilosofosApiContext.Provider
      value={{ isSimulationRunning, getState, startSimulation, stopSimulation }}
    >
      {children}
    </FilosofosApiContext.Provider>
  );
}

export const useFilosofosApi = () => {
  const ctx = useContext(FilosofosApiContext);
  if (!ctx)
    throw new Error(
      "[Filósofos]: useFilosofosApi debe usarse dentro de un FilosofosApiProvider"
    );
  return ctx;
};
