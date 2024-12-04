import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Import CartProvider
import { AuthProvider } from "@/context/AuthContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ToastProvider } from "@/context/ToastContext";
import { ChatbotProvider } from "@/context/ChatBotContext";
import ChatbotUI from "@/components/chatbot/ChatBotUI";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Glamora</title>
      </head>
      <body className="bg-gray-50 text-gray-900">
        {/* Wrap the entire layout with CartProvider */}

        <AuthProvider>
          <ToastProvider>
            <ProductsProvider>
              <CartProvider>
                <ChatbotProvider>
                  {/* Navbar for shared UI */}
                  <Navbar />
                  <ChatbotUI />
                  <main className="min-h-screen">
                    {/* Content for each page */}
                    {children}
                  </main>

                  {/* Footer for shared UI */}
                  <Footer />
                </ChatbotProvider>
              </CartProvider>
            </ProductsProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
