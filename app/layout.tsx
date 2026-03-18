import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const BASE_URL = "https://stackadvisor-nu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "StackAdvisor — Encontrá tu Tech Stack ideal",
    template: "%s | StackAdvisor",
  },
  description:
    "Obtené recomendaciones de tech stack personalizadas en 5 minutos. Del cuestionario al roadmap de producción. 35 stacks evaluados para startups, SaaS y apps.",
  keywords: [
    "tech stack",
    "herramientas developer",
    "startup stack",
    "SaaS",
    "desarrollo web",
    "Next.js",
    "React",
    "motor de recomendación",
    "roadmap desarrollo",
    "comparar stacks",
  ],
  authors: [{ name: "StackAdvisor" }],
  creator: "StackAdvisor",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "StackAdvisor",
    title: "StackAdvisor — Encontrá tu Tech Stack ideal",
    description:
      "Respondé 13 preguntas y descubrí el tech stack perfecto para tu proyecto. Roadmap de 12 semanas incluido.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StackAdvisor — Recomendador de Tech Stacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackAdvisor — Encontrá tu Tech Stack ideal",
    description:
      "Respondé 13 preguntas y descubrí el tech stack perfecto para tu proyecto.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors font-sans">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
