import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Agent - Habla con IA",
  description: "Interfaz de voz para conversar con IA usando OpenAI Realtime API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
