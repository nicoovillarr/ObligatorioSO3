import MainLayout from "@/core/presentation/components/MainLayout";
import { Home } from "@/home/presentation/components/Home";
import { type MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Index() {
  return (
    <MainLayout title="Inicio">
      <Home />
    </MainLayout>
  );
}
