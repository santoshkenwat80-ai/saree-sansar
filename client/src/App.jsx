
import { useEffect } from "react";
import {
  BrowserRouter,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Application Routes
import { AppRoutes } from "./routes/AppRoutes";

/* =========================================
   1. SCROLL TO TOP
========================================= */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

/* =========================================
   2. GLOBAL TOAST NOTIFICATIONS
========================================= */

function GlobalToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 16,
        left: 16,
      }}
      toastOptions={{
        duration: 3500,

        style: {
          background: "#FFFFFF",
          color: "#1C1917",
          border: "1px solid #D4AF37",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "13px",
          fontWeight: 500,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          maxWidth: "100%",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "#059669",
            secondary: "#FFFFFF",
          },
        },

        error: {
          duration: 4000,
          iconTheme: {
            primary: "#E11D48",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}

/* =========================================
   3. APPLICATION CONTENT
========================================= */

function AppContent() {
  return (
    <>
      {/* Route Scroll Management */}
      <ScrollToTop />

      {/* Global Notifications */}
      <GlobalToaster />

      {/* All Application Routes */}
      <AppRoutes />
    </>
  );
}

/* =========================================
   4. MAIN APP COMPONENT
========================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
