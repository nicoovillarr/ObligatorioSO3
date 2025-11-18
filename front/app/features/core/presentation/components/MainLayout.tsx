import { WebSocketProvider } from "../hoooks/useWebsocket";
import AppBar from "./AppBar";
import Footer from "./Footer";

interface MainLayoutProps {
  title: string;
  children: React.ReactNode;
  addBackButton?: boolean;
}

export default function MainLayout({
  title,
  children,
  addBackButton = false,
}: MainLayoutProps) {
  return (
    <WebSocketProvider>
      <main className="w-screen min-h-screen overflow-x-hidden bg-linear-to-b from-gray-950 to-gray-900 text-white flex flex-col">
        <AppBar title={title} addBackButton={addBackButton} />
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </WebSocketProvider>
  );
}
