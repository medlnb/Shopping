import type { Metadata } from "next";
import { Toaster } from "sonner";
import AuthProvider from "@components/AuthProvider";
import "@styles/globals.css";
import Header from "@components/Header/Header";
import Footer from "@components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { CartProvider } from "@contexts/CartContext";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Shopping",
  description: "Your Ultimate online store",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="md:pt-[7.9rem] pt-[13.5rem]">
        <NextIntlClientProvider messages={messages}>
          <Toaster richColors />
          <AuthProvider>
            <CartProvider>
              <Header />
              {children}
            </CartProvider>
          </AuthProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
