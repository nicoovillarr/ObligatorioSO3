import MainLayout from "@/core/presentation/components/MainLayout";
import Filosofos from "@/filosofos/presentation/components/Filosofos";
import { FilosofosApiProvider } from "@/filosofos/presentation/hooks/useFilosofosApi";

export default function FilosofosPage() {
  return (
    <FilosofosApiProvider>
      <MainLayout title="Filósofos" addBackButton>
        <Filosofos />
      </MainLayout>
    </FilosofosApiProvider>
  );
}
