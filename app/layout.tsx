import "./globals.css";
import { HtmlAttributes } from "@/components/layout/HtmlAttributes";

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
