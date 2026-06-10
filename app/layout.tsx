import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConectaTP - Plataforma de Prácticas Profesionales TP",
  description: "Conecta a estudiantes de Educación Técnico-Profesional con empresas. Gestiona prácticas, portafolios y oportunidades laborales en Chile.",
  keywords: "prácticas profesionales, educación TP, empleabilidad, empresas, estudiantes técnicos, Chile",
  authors: [{ name: "ConectaTP" }],
  openGraph: {
    title: "ConectaTP - Puente entre la educación TP y el mundo laboral",
    description: "Plataforma que conecta liceos técnicos, estudiantes y empresas para gestionar prácticas profesionales y empleabilidad.",
    url: "https://conectatp.cl",
    siteName: "ConectaTP",
    images: [
      {
        url: "https://conectatp.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ConectaTP - Plataforma de Prácticas",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConectaTP",
    description: "Gestiona prácticas profesionales en establecimientos TP",
    images: ["https://conectatp.cl/og-image.jpg"],
  },
  icons: {
    con: "/favicon.ico", // ← apunta a la raíz, que servirá el de app/ (por orden de prioridad)
    apple: "/apple-touch-icon.png", // ✅ ya existe
  },
  // ✅ eliminamos 'manifest' para que no pida site.webmanifest
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}