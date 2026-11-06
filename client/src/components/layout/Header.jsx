
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronDown,
  Truck,
  MapPin,
  Download,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

import { AddressModalWithOtp } from "../common/AddressModalWithOtp";
import { GlobalSearchBar } from "./GlobalSearchBar";

/* =========================================
   CATEGORY NAVIGATION DATA
========================================= */

const categoryNavLinks = [
  {
    name: "Banarasi Silk",
    href: "/products?category=banarasi-silk",
    badge: "Varanasi",
  },
  {
    name: "Kanjivaram Silk",
    href: "/products?category=kanjivaram-silk",
    badge: "Temple Zari",
  },
  {
    name: "Chanderi & Organza",
    href: "/products?category=chanderi-organza",
    badge: "Featherlight",
  },
  {
    name: "Georgette & Chiffon",
    href: "/products?category=georgette-chiffon",
    badge: "Fluid Jaal",
  },
  {
    name: "Handloom Cotton",
    href: "/products?category=handloom-cotton",
    badge: "Jamdani",
  },
  {
    name: "Bridal Heritage",
    href: "/products?category=bridal-heritage",
    badge: "Trousseau",
  },
  {
    name: "All Sarees",
    href: "/products",
  },
  {
    name: "Collections",
    href: "/categories",
  },
];

/* =========================================
   HEADER COMPONENT
========================================= */

export const Header = () => {
  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const accountRef = useRef(null);

  // Context
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  // Router
  const location = useLocation();

  // Default Address
  const defaultAddress =
    user?.addresses?.find((address) => address.isDefault) ||
    user?.addresses?.[0];

  /* =========================================
     SCROLL EFFECT
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================
     CLOSE ACCOUNT MENU ON OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     CLOSE MENUS WHEN ROUTE CHANGES
  ========================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname, location.search]);

  /* =========================================
     MOBILE MENU BODY SCROLL
  ========================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =========================================
     HELPER FUNCTIONS
  ========================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
  };

  const isActiveLink = (href) => {
    const url = new URL(href, window.location.origin);

    return (
      location.pathname === url.pathname &&
      location.search === url.search
    );
  };

  /* =========================================
     ACCOUNT DROPDOWN
  ========================================= */

  const AccountDropdown = () => (
    <div
      ref={accountRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setAccountMenuOpen((prev) => !prev)}
        aria-label="Account options"
        aria-expanded={accountMenuOpen}
        className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-lg text-stone-700 hover:bg-stone-100 hover:text-[#881930] transition-colors"
      >
        <User className="w-5 h-5 shrink-0" />

        <span className="hidden xl:inline text-xs font-medium">
          {isAuthenticated
            ? user?.name?.split(" ")[0] || "Account"
            : "Sign In"}
        </span>

        <ChevronDown className="hidden xl:inline w-3 h-3" />
      </button>

      {accountMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-24px)] bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in-95">

          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
                <p className="text-[11px] text-stone-400">
                  Signed in as
                </p>

                <p className="text-sm font-semibold text-stone-900 truncate">
                  {user?.name}
                </p>

                <span className="text-[10px] text-[#a07817] font-semibold uppercase">
                  {isAdmin ? "Administrator" : "Valued Patron"}
                </span>
              </div>

              <Link
                to="/profile"
                className="block px-4 py-2.5 text-xs hover:bg-stone-50"
              >
                My Profile & Addresses
              </Link>

              <Link
                to="/my-orders"
                className="block px-4 py-2.5 text-xs hover:bg-stone-50"
              >
                Order History & Tracking
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#881930] font-semibold hover:bg-rose-50"
                >
                  <Shield className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-stone-100">
                <p className="text-xs font-semibold text-stone-900">
                  Welcome to Maheshram Dewangan & Bros.
                </p>

                <p className="text-[11px] text-stone-500">
                  Access your saved sarees and orders
                </p>
              </div>

              <Link
                to="/login"
                className="block px-4 py-2.5 text-xs font-bold text-[#881930] hover:bg-rose-50"
              >
                Sign In with Password
              </Link>

              <Link
                to="/register"
                className="block px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50"
              >
                Create New Account
              </Link>
            </>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 border-t border-stone-100"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </div>
  );

  /* =========================================
     MAIN HEADER JSX
  ========================================= */

  return (
    <>
      {/* =====================================
          1. ANNOUNCEMENT BAR
      ===================================== */}

      <div className="w-full bg-gradient-to-r from-[#4a0e1b] via-[#5c1223] to-[#4a0e1b] text-amber-100 border-b border-[#6b1426]">

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2">

          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#f2ce6e]" />

            <p className="text-[10px] sm:text-xs truncate">
              <strong className="text-[#f2ce6e]">
                Festive Splendor:
              </strong>{" "}
              Authentic Handloom Sarees · Silk Mark Certified · Free Insured Express Delivery Above ₹2,000
            </p>
          </div>

          <Link
            to="/order-tracking"
            className="hidden sm:flex items-center gap-1.5 shrink-0 text-amber-200 text-xs font-semibold hover:text-white"
          >
            <Truck className="w-3.5 h-3.5" />
            Track Order
          </Link>

        </div>
      </div>

      {/* =====================================
          2. MAIN HEADER
      ===================================== */}

      <header
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled
            ? "shadow-md border-stone-200"
            : "shadow-sm border-stone-200"
        }`}
      >

        {/* TOP HEADER ROW */}

        <div
          className={`w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-between gap-1 sm:gap-4 min-w-0 ${
            isScrolled ? "h-16" : "h-[72px] sm:h-20"
          }`}
        >

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden shrink-0 p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* BRAND LOGO */}

          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink flex-1 lg:flex-none group"
            aria-label="Maheshram Dewangan and Bros Home"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-[#6b1426] to-[#520f1d] text-[#f2ce6e] flex items-center justify-center shadow-md border border-[#f2ce6e]/40">
              <span className="font-serif text-base sm:text-xl font-bold">
                MD
              </span>
            </div>

            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-serif text-[12px] min-[380px]:text-sm sm:text-xl lg:text-2xl font-bold tracking-tight text-[#6b1426] whitespace-nowrap">
                Maheshram Dewangan &amp; Bros.
              </span>

              <span className="text-[7px] min-[380px]:text-[8px] sm:text-[10px] uppercase tracking-wider text-[#a07817] font-semibold mt-1 truncate">
                Handloom Tussar Silk · Champa (C.G.)
              </span>
            </div>
          </Link>

          {/* DELIVERY ADDRESS - DESKTOP */}

          <button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="hidden xl:flex shrink-0 items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:border-[#881930] transition-colors"
          >
            <MapPin className="w-5 h-5 text-[#881930]" />

            <div className="text-left">
              <p className="text-[10px] text-stone-500">
                Deliver to
              </p>

              <p className="text-xs font-bold text-stone-800 truncate max-w-[120px]">
                {defaultAddress
                  ? `${defaultAddress.city} - ${defaultAddress.pincode}`
                  : "Add Address"}
              </p>
            </div>
          </button>

          {/* DESKTOP SEARCH */}

          <div className="hidden md:flex flex-1 min-w-0 max-w-xl">
            <GlobalSearchBar variant="desktop" />
          </div>

          {/* ACTION ICONS */}

          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">

            <AccountDropdown />

            {/* TRACK ORDER */}

            <Link
              to="/order-tracking"
              aria-label="Track Order"
              className="hidden sm:flex items-center justify-center p-2 rounded-lg hover:bg-stone-100"
            >
              <Truck className="w-5 h-5 text-stone-700" />
              <span className="hidden xl:inline text-xs ml-1">
                Track
              </span>
            </Link>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-lg hover:bg-stone-100"
            >
              <Heart className="w-5 h-5 text-stone-700" />

              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#881930] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}

            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2 rounded-lg hover:bg-stone-100"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700" />

              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#881930] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* =====================================
            3. DESKTOP CATEGORY NAVIGATION
        ===================================== */}

        <div className="hidden lg:block border-t border-stone-100 bg-[#FCF9F5]">

          <nav className="max-w-7xl mx-auto px-4 lg:px-8 min-h-12 flex items-center justify-center gap-5 xl:gap-7 text-xs font-semibold uppercase tracking-wide">

            {categoryNavLinks.map((category) => {
              const active = isActiveLink(category.href);

              return (
                <Link
                  key={category.name}
                  to={category.href}
                  className={`whitespace-nowrap py-3 border-b-2 transition-colors ${
                    active
                      ? "text-[#6b1426] border-[#6b1426]"
                      : "text-stone-700 border-transparent hover:text-[#881930] hover:border-[#881930]"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}

          </nav>
        </div>

        {/* =====================================
            4. MOBILE SEARCH
        ===================================== */}

        <div className="md:hidden w-full min-w-0 px-3 py-2.5 border-t border-stone-200 bg-stone-50">
          <GlobalSearchBar variant="mobile" />
        </div>

        {/* =====================================
            5. MOBILE CATEGORY RIBBON
        ===================================== */}

        <div className="lg:hidden w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain border-t border-stone-200 bg-[#FCF9F5] px-3 py-2 no-scrollbar">

          <nav className="flex items-center gap-2 w-max whitespace-nowrap">

            {categoryNavLinks.map((category) => {
              const active = isActiveLink(category.href);

              return (
                <Link
                  key={category.name}
                  to={category.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold border transition-colors ${
                    active
                      ? "bg-[#6b1426] text-white border-[#6b1426]"
                      : "bg-white text-stone-700 border-stone-200 hover:border-[#881930]"
                  }`}
                >
                  {category.name}

                  {category.badge && (
                    <span className="text-[9px] text-[#a07817]">
                      {category.badge}
                    </span>
                  )}
                </Link>
              );
            })}

          </nav>
        </div>

        {/* =====================================
            6. MOBILE MENU DRAWER
        ===================================== */}

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full max-w-full bg-white border-t border-stone-200 shadow-xl z-50">

            <div className="max-h-[calc(100dvh-150px)] overflow-y-auto overscroll-contain p-4 space-y-4">

              {/* DELIVERY ADDRESS */}

              <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">

                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-5 h-5 shrink-0 text-[#881930]" />

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase text-stone-500">
                      Deliver to
                    </p>

                    <p className="text-xs font-bold text-stone-800 truncate">
                      {defaultAddress
                        ? `${defaultAddress.fullName} · ${defaultAddress.city} ${defaultAddress.pincode}`
                        : "Add Address"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    setIsAddressModalOpen(true);
                  }}
                  className="shrink-0 text-xs font-bold text-[#881930] bg-white border border-rose-200 rounded-lg px-3 py-2"
                >
                  {defaultAddress ? "Change" : "Add"}
                </button>
              </div>

              {/* CATEGORY LINKS */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                    Shop By Category
                  </p>

                  <span className="text-[10px] text-stone-400">
                    Authentic Handlooms
                  </span>
                </div>

                <nav className="space-y-1">
                  {categoryNavLinks.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between gap-2 px-3 py-3 rounded-lg text-sm text-stone-700 hover:bg-rose-50 hover:text-[#881930]"
                    >
                      <span className="font-medium">
                        {category.name}
                      </span>

                      {category.badge && (
                        <span className="text-[10px] text-[#a07817]">
                          {category.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* AUTHENTICATION */}

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="text-center py-3 rounded-lg bg-[#6b1426] text-white text-xs font-bold"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="text-center py-3 rounded-lg bg-rose-50 border border-rose-200 text-[#881930] text-xs font-bold"
                  >
                    Register
                  </Link>

                </div>
              )}

              {/* SHOPPING LINKS */}

              <div className="border-t border-stone-100 pt-3 space-y-1">

                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Shopping Bag
                  </span>

                  <span className="text-xs font-bold">
                    {totalItemsCount}
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4" />
                    Saved Sarees
                  </span>

                  <span className="text-xs font-bold">
                    {wishlistCount}
                  </span>
                </Link>

                <Link
                  to="/order-tracking"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-stone-50 text-sm"
                >
                  <Truck className="w-4 h-4" />
                  Track Order
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-stone-50 text-sm"
                  >
                    <User className="w-4 h-4" />
                    My Profile & Orders
                  </Link>
                )}

                <Link
                  to="/download"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[#881930] text-sm font-bold"
                >
                  <Download className="w-4 h-4" />
                  Download MERN Project (.ZIP)
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 p-3 text-sm font-bold text-[#881930]"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left p-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                )}

              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================
          7. ADDRESS MODAL
      ===================================== */}

      <AddressModalWithOtp
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => setIsAddressModalOpen(false)}
        title="Delivery Address & Contact Details"
      />
    </>
  );
};
