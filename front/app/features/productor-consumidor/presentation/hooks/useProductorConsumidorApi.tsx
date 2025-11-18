import { API_BASE_URL } from "app/libs/constants";
import React, { createContext, useState, useCallback, useContext } from "react";

const PRODUCTOR_CONSUMIDOR_API_URL = `${API_BASE_URL}/productor-consumidor`;

interface IProductorConsumidorApiContext {
  isSimulationRunning: boolean;
  getState: () => Promise<{
    isRunning: boolean;
    productoresCount: number;
    consumidoresCount: number;
    bufferSize: number;
    bufferCapacity: number;
  }>;
  startSimulation: (
    capacity: number,
    productores: number,
    consumidores: number
  ) => void;
  stopSimulation: () => void;
}

export const ProductorConsumidorApiContext =
  createContext<IProductorConsumidorApiContext | null>(null);

export function ProductorConsumidorApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const startSimulation = useCallback(
    async (capacidad: number, productores: number, consumidores: number) => {
      const response = await fetch(`${PRODUCTOR_CONSUMIDOR_API_URL}/iniciar`, {
        method: "POST",
        body: JSON.stringify({ capacidad, productores, consumidores }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          "[Productor/Consumidor]: Error al iniciar la simulación"
        );
      }

      setIsSimulationRunning(true);
      console.log("[Productor/Consumidor]: Iniciando simulación...");
    },
    []
  );

  const stopSimulation = useCallback(async () => {
    const response = await fetch(`${PRODUCTOR_CONSUMIDOR_API_URL}/detener`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("[Productor/Consumidor]: Error al detener la simulación");
    }

    setIsSimulationRunning(false);
    console.log("[Productor/Consumidor]: Deteniendo simulación...");
  }, []);

  const getState = useCallback(async () => {
    const response = await fetch(`${PRODUCTOR_CONSUMIDOR_API_URL}/estado`);
    if (!response.ok) {
      throw new Error(
        "[Productor/Consumidor]: Error al consultar el estado de la simulación"
      );
    }

    const data = await response.json();
    const {
      isRunning,
      productoresCount,
      consumidoresCount,
      bufferSize,
      bufferCapacity,
    } = data;

    setIsSimulationRunning(isRunning);

    return {
      isRunning,
      productoresCount,
      consumidoresCount,
      bufferSize,
      bufferCapacity,
    };
  }, []);

  return (
    <ProductorConsumidorApiContext.Provider
      value={{ isSimulationRunning, getState, startSimulation, stopSimulation }}
    >
      {children}
    </ProductorConsumidorApiContext.Provider>
  );
}

export const useProductorConsumidorApi = () => {
  const ctx = useContext(ProductorConsumidorApiContext);
  if (!ctx)
    throw new Error(
      "[Productor/Consumidor]: useProductorConsumidorApi debe usarse dentro de un ProductorConsumidorApiProvider"
    );
  return ctx;
};
