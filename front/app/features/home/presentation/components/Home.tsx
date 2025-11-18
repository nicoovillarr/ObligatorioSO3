import Button from "@/core/presentation/components/Button";

export function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Problemas Clásicos de Concurrencia
      </h1>
      <p className="text-lg">
        Selecciona un problema para aprender más sobre él:
      </p>
      <ul className="flex flex-col items-center justify-center">
        <li className="mt-2">
          <Button href="/filosofos">Filósofos</Button>
        </li>
        <li className="mt-2">
          <Button href="/productor-consumidor">Productor-Consumidor</Button>
        </li>
      </ul>
    </main>
  );
}
