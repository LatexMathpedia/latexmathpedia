import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MathTexpedia | Apuntes de Informática y Matemáticas - UniOvi",
  description:
    "Repositorio de apuntes de carrera universitaria en informática y matemáticas en la Universidad de Oviedo. Recursos claros, organizados y actualizados para estudiantes.",
  keywords: [
    "MathTexpedia",
    "apuntes universidad",
    "informática",
    "matemáticas",
    "Universidad de Oviedo",
    "recursos académicos",
    "ingeniería informática",
    "ciencia de datos",
    "álgebra",
    "cálculo",
    "estadística",
    "machine learning",
    "teoría de la computación",
    "uniovi",
    "Oviedo",
    "apuntes LaTeX",
    "apuntes PDF",
    "estudios universitarios",
    "recursos para estudiantes",
    "apuntes gratuitos",
    "material de estudio",
  ],
  authors: [
    { name: "Diego Díaz Mendaña", url: "https://diego-diaz-mendana.web.app/" },
    { name: "Pablo García Pernas", url: "https://www.linkedin.com/in/pablo-garc%C3%ADa-pernas-873630352/" }
  ],
  metadataBase: new URL("https://www.mathtexpedia.es"),
  creator: "MathTexpedia",
  publisher: "MathTexpedia",
  alternates: {
    canonical: "https://mathtexpedia.es",
  },
  openGraph: {
    title: "MathTexpedia | Apuntes de Informática y Matemáticas - UniOvi",
    description:
      "Repositorio de apuntes de carrera universitaria en informática y matemáticas en la Universidad de Oviedo. Recursos claros, organizados y actualizados para estudiantes.",
    url: "https://mathtexpedia.es",
    siteName: "MathTexpedia",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/app/icon.png",
        width: 1200,
        height: 630,
        alt: "MathTexpedia Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MathTexpedia | Apuntes de Informática y Matemáticas - UniOvi",
    description:
      "Repositorio de apuntes de carrera universitaria en informática y matemáticas en la Universidad de Oviedo. Recursos claros, organizados y actualizados para estudiantes.",
    images: ["/app/icon.png"],
    creator: "@MathsTexpedia",
    site: "@MathsTexpedia",
  },
  icons: {
    icon: "/app/icon.png",
    shortcut: "/app/icon.png",
    apple: "/app/icon-apple.png",
    other: {
      rel: "apple-touch-icon-precomposed", url: "/app/icon-apple.png",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
  applicationName: "MathTexpedia",
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}