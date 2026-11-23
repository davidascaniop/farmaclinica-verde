import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import Persistencia from "@/components/Persistencia";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FarmaClínica Verde | Farmacia en línea",
  description: "Prototipo de farmacia en línea de FarmaClínica Verde con datos de ejemplo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Persistencia />
        <Encabezado />
        <main className="flex-1">{children}</main>
        <Pie />
      </body>
    </html>
  );
}
