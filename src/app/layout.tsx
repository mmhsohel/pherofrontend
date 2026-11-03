import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "StudioSpace — Book Creative Studios", description: "Peer-to-peer creative workspace marketplace" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content">
        <ThemeProvider attribute="data-theme" themes={["studiolight", "studiodark"]}
          defaultTheme="studiolight" enableSystem={false}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}