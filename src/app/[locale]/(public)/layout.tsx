import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </CurrencyProvider>
  );
}
