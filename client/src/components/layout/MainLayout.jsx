
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { MobileBottomNav } from "./MobileBottomNav";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#FCF9F5]">

      {/* Header */}
      <Header />

      {/* Main Page Content */}
      <main className="w-full min-w-0 flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

    </div>
  );
};
