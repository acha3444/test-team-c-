import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "La Team C - Restaurant, Cocktail, Café & Cantine à Marseillan",
  description: "Découvrez La Team C à Marseillan. Cocktail, café et cantine. Cuisine du jour, événements, escape game culinaire. Ouvert de 09h00 à 23h00.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FDFBF7] text-[#1A1A1A] antialiased selection:bg-[#c69c38] selection:text-white`}>
        {children}
        <Toaster position="bottom-center" richColors theme="light" />
      </body>
    </html>
  );
}
