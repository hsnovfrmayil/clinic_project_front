import type { Metadata } from "next";
import { Manrope, Playfair_Display, Fredoka } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorFX from "@/components/CursorFX";
import SiteIntro from "@/components/SiteIntro";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["italic", "normal"],
  subsets: ["latin", "cyrillic"],
});

const fredoka = Fredoka({
  variable: "--font-logo",
  weight: ["600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EONAGE — Clinic from the Future",
  description:
    "EONAGE — научная линия ухода за кожей от эстетической клиники будущего. Наука. Красота. Технологии.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${manrope.variable} ${playfair.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-mist">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('eonage-theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}",
          }}
        />
        <SiteIntro />
        <CursorFX />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
