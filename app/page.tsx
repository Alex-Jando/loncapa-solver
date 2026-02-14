import type { Metadata } from "next";
import HomePageClient from "@/app/HomePageClient";

export const metadata: Metadata = {
  title: "NO-CAPA | Extract. Map. Solve.",
  description:
    "NO-CAPA helps you upload LON-CAPA PDFs, extract problem values, and solve assignments with formatted outputs.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
