import type { Metadata } from "next";
import { Toaster } from "sonner";
import AuthProvider from "@components/AuthProvider";
import "@styles/globals.css";
import Header from "@components/Header/Header";
import Footer from "@components/Footer";
import { CartProvider } from "@contexts/CartContext";

export const metadata: Metadata = {
  title: "Shopping",
  description: "Your Ultimate online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="md:pt-[7.9rem] pt-[13.5rem]">
        <Toaster richColors />
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
