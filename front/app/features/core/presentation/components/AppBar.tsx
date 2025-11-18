import { useEffect, useState } from "react";

interface AppBarProps {
  title: string;
  addBackButton?: boolean;
}

export default function AppBar({ title, addBackButton = false }: AppBarProps) {
  const [filosofos, setFilosofos] = useState(0);

  useEffect(() => {

  }, []);

  return (
    <header className="w-full h-16 py-4 bg-gray-800 text-center text-lg font-semibold text-white flex items-center shadow-md pl-6">
      {addBackButton && (
        <button
          className="text-white mr-4 text-2xl font-bold cursor-pointer"
          onClick={() => window.history.back()}
        >
          ←
        </button>
      )}
      <h1>{title}</h1>
    </header>
  );
}
