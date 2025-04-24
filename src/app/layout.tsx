import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppLayout from "@/components/layouts/app-layout";
import ErrorBoundary from "@/components/error-boundary";

const MuseoSlab = localFont({
  src: "./fonts/Museo-slab/Museo_Slab_700.otf",
  variable: "--font-museo-slab",
  weight: "700",
});

const Montserrat = localFont({
  src: "./fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VoIP | LinkOrg VoIP",
  description: "LinkOrgNet VoIP Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${MuseoSlab.variable} ${Montserrat.variable} font-montserrat`}
      >
        <ErrorBoundary>
          <AppLayout attribute="class" defaultTheme="light" enableSystem>
            {children}
          </AppLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
