import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LON-CAPA PDF Extractor",
  description: "Extract numeric values and units from LON-CAPA assignment PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

