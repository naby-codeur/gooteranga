import "./globals.css";
import { HtmlAttributes } from "@/components/layout/HtmlAttributes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GooTeranga",
  description: "Plateforme de tourisme au Sénégal - Découvrez les meilleures expériences touristiques",
  icons: {
    icon: "/logo_gooteranga.png",
    apple: "/logo_gooteranga.png",
    shortcut: "/logo_gooteranga.png",
  },
  openGraph: {
    title: "GooTeranga",
    description: "Plateforme de tourisme au Sénégal - Découvrez les meilleures expériences touristiques",
    images: [
      {
        url: "/logo_gooteranga.png",
        width: 512,
        height: 512,
        alt: "GooTeranga Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GooTeranga",
    description: "Plateforme de tourisme au Sénégal - Découvrez les meilleures expériences touristiques",
    images: ["/logo_gooteranga.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Next.js nécessite les balises html et body dans le layout racine
  // Le composant HtmlAttributes mettra à jour lang et dir dynamiquement selon la locale
  return (
    <html lang="fr" dir="ltr">
      <body className="font-sans antialiased">
        <HtmlAttributes />
        {children}
      </body>
    </html>
  );
}
