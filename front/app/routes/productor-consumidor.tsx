import MainLayout from "@/core/presentation/components/MainLayout";
import { ProductorConsumidor } from "@/productores-consumidores/presentation/components/ProductorConsumidor";
import { ProductorConsumidorApiProvider } from "@/productores-consumidores/presentation/hooks/useProductorConsumidorApi";

export default function ProductorConsumidorPage() {
  return (
    <ProductorConsumidorApiProvider>
      <MainLayout title="Productor / Consumidor" addBackButton>
        <ProductorConsumidor />
      </MainLayout>
    </ProductorConsumidorApiProvider>
  );
}
