import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malibu Ateliê | Moda em Crochê Artesanal",
  description: "Descubra peças exclusivas de crochê feitas à mão no Malibu Ateliê. Catálogo completo, encomendas personalizadas e novidades da moda artesanal.",
  openGraph: {
    title: "Malibu Ateliê | Moda em Crochê Artesanal",
    description: "Descubra peças exclusivas de crochê feitas à mão no Malibu Ateliê. Catálogo completo, encomendas personalizadas e novidades da moda artesanal.",
    type: "website",
    url: "https://malibuatelie.com.br/",
    images: [
      {
        url: "https://malibuatelie.com.br/assets/social.png",
        width: 1200,
        height: 630,
        alt: "Malibu Ateliê - Moda em Crochê Artesanal",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Malibu Ateliê" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
