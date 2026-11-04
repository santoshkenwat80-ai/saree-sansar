import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AppRoutes } from "./routes/AppRoutes";
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
export default function App() {
  return <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Toaster
    position="top-right"
    toastOptions={{
      duration: 3500,
      style: {
        background: "#FFFFFF",
        color: "#1C1917",
        border: "1px solid #D4AF37",
        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 500
      },
      success: {
        iconTheme: {
          primary: "#059669",
          secondary: "#FFFFFF"
        }
      },
      error: {
        iconTheme: {
          primary: "#E11D48",
          secondary: "#FFFFFF"
        }
      }
    }}
  />
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>;
}
