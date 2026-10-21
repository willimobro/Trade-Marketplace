import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trade Marketplace",
  description: "Get quotes from licensed local tradies - individuals, not just big firms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-forest text-white/60 text-xs">
          <div className="mx-auto max-w-6xl px-4 py-6 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>© {new Date().getFullYear()} Trade Marketplace · Made in Invercargill</span>
            <span>Tradies are responsible for their own licensing, insurance and certificates of compliance.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
