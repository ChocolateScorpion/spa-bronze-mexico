import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { business } from "@/lib/business";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: business.nombre,
  description: `Panel de administración de ${business.nombre}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={
        {
          "--color-primary": business.colores.primario,
          "--color-secondary": business.colores.secundario,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full min-h-screen flex-col md:flex-row bg-[var(--color-secondary)]">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
