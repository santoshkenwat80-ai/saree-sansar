import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Download
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { AddressModalWithOtp } from "../common/AddressModalWithOtp";
import { GlobalSearchBar } from "./GlobalSearchBar";
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);
  const categoryNavLinks = [
    { name: "Banarasi Silk", href: "/products?category=banarasi-silk", badge: "Varanasi" },
    { name: "Kanjivaram Silk", href: "/products?category=kanjivaram-silk", badge: "Temple Zari" },
    { name: "Chanderi & Organza", href: "/products?category=chanderi-organza", badge: "Featherlight" },
    { name: "Georgette & Chiffon", href: "/products?category=georgette-chiffon", badge: "Fluid Jaal" },
    { name: "Handloom Cotton", href: "/products?category=handloom-cotton", badge: "Jamdani" },
    { name: "Bridal Heritage", href: "/products?category=bridal-heritage", badge: "Trousseau" },
    { name: "All Sarees", href: "/products" },
    { name: "Collections", href: "/categories" }
  ];
  const megaCategories = [
    {
      name: "Banarasi Silk Sarees",
      href: "/products?category=banarasi-silk",
      provenance: "Varanasi, Uttar Pradesh",
      desc: "Pure Katan and Tanchoi silk handwoven with authentic gold & silver zari floral jaal",
      highlight: "Geographical Indication (GI) Protected"
    },
    {
      name: "Kanjivaram Temple Silk",
      href: "/products?category=kanjivaram-silk",
      provenance: "Kanchipuram, Tamil Nadu",
      desc: "Three-ply twisted mulberry silk with contrast Korvai borders and temple motifs",
      highlight: "Heavy Pure Zari Pallu"
    },
    {
      name: "Chanderi & Sheer Organza",
      href: "/products?category=chanderi-organza",
      desc: "Featherlight gossamer texture woven with fine silk and cotton gold zari butis",
      provenance: "Chanderi, Madhya Pradesh",
      highlight: "Sublime Royal Sheer"
    },
    {
      name: "Georgette & Chiffon Sarees",
      href: "/products?category=georgette-chiffon",
      desc: "Flowy graceful drapes adorned with Chikankari embroidery and festive border jaals",
      provenance: "Awadh & Kashmir Weaves",
      highlight: "Fluid Festive Elegance"
    },
    {
      name: "Handloom Artisan Cotton",
      href: "/products?category=handloom-cotton",
      desc: "Breathable, handspun Jamdani, Khadi and Champa handloom weaves for all-day comfort",
      provenance: "Bengal & Chhattisgarh Looms",
      highlight: "100% Natural Handspun"
    },
    {
      name: "Bridal & Trousseau Heritage",
      href: "/products?category=bridal-heritage",
      desc: "Opulent heirloom sarees crafted with real zari, zardozi work, and sacred wedding motifs",
      provenance: "Heritage Master Weavers",
      highlight: "Bridal Masterpiece"
    }
  ];
  return <>
      {
    /* 1. Top Offer / Announcement Bar (Royal Heritage Theme - Warm & Luminous) */
  }
      <div className="bg-gradient-to-r from-[#4a0e1b] via-[#5c1223] to-[#4a0e1b] text-amber-100 text-xs font-medium py-1.5 px-4 tracking-wide border-b border-[#6b1426] shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#f2ce6e]" />
            <span className="text-stone-100">
              <strong className="text-[#f2ce6e] font-semibold">Festive Splendor:</strong> Authentic Handloom Sarees · Silk Mark Certified · Free Insured Express Delivery Above ₹2,000
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 ml-4">
            <Link
    to="/download"
    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 hover:from-amber-200 hover:to-amber-100 text-[#4a0e1b] font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-xs transition-all cursor-pointer border border-amber-400"
    title="Download Complete MERN Stack Project Source Code (.ZIP)"
  >
              <Download className="w-3.5 h-3.5 text-[#881930]" />
              <span>Download MERN Stack (.ZIP)</span>
            </Link>

            {!isAuthenticated && <Link
    to="/login"
    className="hidden md:inline-flex items-center gap-1.5 bg-[#f2ce6e] hover:bg-[#ffe394] text-[#4a0e1b] font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-xs transition-colors cursor-pointer"
  >
                <span>Sign In</span>
              </Link>}
            <Link
    to="/order-tracking"
    className="hidden sm:inline-flex items-center gap-1.5 text-amber-200/90 hover:text-white font-semibold transition-colors shrink-0"
  >
              <Truck className="w-3.5 h-3.5 text-[#f2ce6e]" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>

      {
    /* 2. Main Sticky Navigation Header */
  }
      <header
    className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? "shadow-md border-stone-200/90 bg-white/98" : "shadow-xs border-stone-200"}`}
  >
        {
    /* Upper Zone: Logo, Search Input & Utility Icons */
  }
        <div
    className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8 transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}
  >
          {
    /* Mobile Hamburger Toggle */
  }
          <div className="flex items-center lg:hidden">
            <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="text-stone-700 p-2 hover:bg-stone-100 rounded-md transition-colors"
    aria-label="Toggle navigation menu"
  >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {
    /* Brand Logo & Royal Wordmark */
  }
          <Link
    to="/"
    className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-none"
    aria-label="Maheshram Dewangan & Bros. Home"
  >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#6b1426] via-[#881930] to-[#520f1d] text-[#f2ce6e] flex items-center justify-center shadow-md border border-[#f2ce6e]/40 group-hover:border-[#f2ce6e] transition-all transform group-hover:scale-105 shrink-0">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight select-none">MD</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#6b1426] group-hover:text-[#881930] transition-colors whitespace-nowrap">
                Maheshram Dewangan &amp; Bros.
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#a07817] font-semibold mt-1">
                Handloom Tussar Silk · Champa (C.G.)
              </span>
            </div>
          </Link>

          {
    /* Quick Deliver To Address Pill with Live Database Status */
  }
          <button
    type="button"
    onClick={() => setIsAddressModalOpen(true)}
    className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#881930] bg-stone-50/80 hover:bg-rose-50/40 text-left transition-all cursor-pointer group shrink-0"
    title="Select Delivery Address"
  >
            <div className="w-7 h-7 rounded-full bg-rose-100 group-hover:bg-[#881930] text-[#881930] group-hover:text-white flex items-center justify-center transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-stone-500 font-medium">
                {defaultAddress?.fullName ? `Deliver to ${defaultAddress.fullName.split(" ")[0]}` : "Deliver to"}
              </span>
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#881930] truncate max-w-[130px]">
                {defaultAddress ? `${defaultAddress.city} - ${defaultAddress.pincode}` : "Add Address"}
              </span>
            </div>
          </button>

          {
    /* Global Search Bar (Desktop & Tablet) - Filters catalog by Name, Material, or Color */
  }
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
            <GlobalSearchBar variant="desktop" />
          </div>

          {
    /* Action Icons: Account, Wishlist, Cart */
  }
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {
    /* Account Icon & Dropdown */
  }
            <div className="relative">
              <button
    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
    className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors cursor-pointer"
    aria-label="Account Options"
  >
                <User className="w-5 h-5 text-stone-700" />
                <span className="hidden xl:inline text-xs font-medium text-stone-700">
                  {isAuthenticated ? user?.name ? user.name.split(" ")[0] : "Account" : "Sign In"}
                </span>
                <ChevronDown className="hidden xl:inline w-3 h-3 text-stone-400" />
              </button>

              {accountMenuOpen && <div
    className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
    onMouseLeave={() => setAccountMenuOpen(false)}
  >
                  {isAuthenticated ? <>
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                        <p className="text-[11px] text-stone-400">Signed in as</p>
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {user?.name}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] text-[#a07817] font-semibold uppercase tracking-wider">
                          {user?.role === "admin" ? "Administrator" : "Valued Patron"}
                        </span>
                      </div>
                      <Link
    to="/profile"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#6b1426]"
  >
                        My Profile &amp; Addresses
                      </Link>
                      <Link
    to="/my-orders"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#6b1426]"
  >
                        Order History &amp; Tracking
                      </Link>
                      <Link
    to="/download"
    onClick={() => setAccountMenuOpen(false)}
    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border-t border-amber-200/80"
  >
                        <Download className="w-3.5 h-3.5 text-[#881930]" />
                        <span>Download MERN Project (.ZIP)</span>
                      </Link>
                      {isAdmin && <Link
    to="/admin/dashboard"
    onClick={() => setAccountMenuOpen(false)}
    className="flex items-center gap-2 px-4 py-2 text-xs text-[#881930] font-semibold hover:bg-rose-50"
  >
                          <Shield className="w-3.5 h-3.5" /> Admin Console
                        </Link>}
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
    onClick={() => {
      logout();
      setAccountMenuOpen(false);
    }}
    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
  >
                          Sign Out
                        </button>
                      </div>
                    </> : <>
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                        <p className="text-xs font-semibold text-stone-900">Welcome to Maheshram Dewangan &amp; Bros.</p>
                        <p className="text-[11px] text-stone-500">Access your saved sarees and orders</p>
                      </div>
                      <Link
    to="/login"
    onClick={() => setAccountMenuOpen(false)}
    className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-[#6b1426] hover:bg-rose-50/70 transition-colors"
  >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#881930]" />
                          <span>Sign In with Password</span>
                        </div>
                      </Link>
                      <Link
    to="/register"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
  >
                        Create New Account (Register)
                      </Link>
                      <Link
    to="/download"
    onClick={() => setAccountMenuOpen(false)}
    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border-t border-amber-200/80"
  >
                        <Download className="w-3.5 h-3.5 text-[#881930]" />
                        <span>Download MERN Project (.ZIP)</span>
                      </Link>
                    </>}
                </div>}
            </div>

            {
    /* Direct Track Order Button */
  }
            <Link
    to="/order-tracking"
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5"
    title="Track Order Status"
    aria-label="Track Order"
  >
              <Truck className="w-5 h-5 text-stone-700" />
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Track
              </span>
            </Link>

            {
    /* Wishlist Icon */
  }
            <Link
    to="/wishlist"
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5"
    title="Wishlist (Saved Sarees)"
    aria-label="Wishlist"
  >
              <div className="relative">
                <Heart className="w-5 h-5 text-stone-700" />
                {wishlistCount > 0 && <span className="sm:hidden absolute -top-1.5 -right-2 bg-[#881930] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center font-mono tabular-nums shadow-xs ring-1 ring-white">
                    {wishlistCount}
                  </span>}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Wishlist
              </span>
              {wishlistCount > 0 && <span className="hidden sm:inline-flex bg-[#881930] text-white text-[10px] font-bold rounded-full h-4.5 px-1.5 items-center justify-center font-mono tabular-nums shadow-xs">
                  {wishlistCount}
                </span>}
            </Link>

            {
    /* Cart Icon & Drawer Trigger */
  }
            <button
    onClick={() => setIsCartDrawerOpen(true)}
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
    title="Shopping Cart (Shopping Bag)"
    aria-label="Cart"
  >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-700" />
                {totalItemsCount > 0 && <span className="sm:hidden absolute -top-1.5 -right-2 bg-[#881930] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center font-mono tabular-nums shadow-xs ring-1 ring-white">
                    {totalItemsCount}
                  </span>}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Cart
              </span>
              {totalItemsCount > 0 && <span className="hidden sm:inline-flex bg-[#881930] text-white text-[10px] font-bold rounded-full h-4.5 px-1.5 items-center justify-center font-mono tabular-nums shadow-xs">
                  {totalItemsCount}
                </span>}
            </button>
          </div>
        </div>

        {
    /* Lower Zone: Saree Category Navigation Links (Desktop) */
  }
        <div className="hidden lg:block border-t border-stone-100 bg-[#FCF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-7 xl:gap-9 h-12 text-xs font-semibold uppercase tracking-wider text-stone-700">
              {categoryNavLinks.map((link) => {
    const isActive = location.pathname + location.search === link.href;
    const isHeritage = ["Banarasi", "Kanjivaram", "Silk", "Bridal"].includes(link.name);
    return <Link
      key={link.name}
      to={link.href}
      className={`whitespace-nowrap transition-all py-2 border-b-2 flex items-center gap-1.5 ${isActive ? "text-[#6b1426] border-[#6b1426] font-bold" : isHeritage ? "text-stone-900 border-transparent hover:text-[#6b1426] hover:border-[#6b1426]" : "text-stone-600 border-transparent hover:text-[#6b1426] hover:border-stone-300"}`}
    >
                    {isHeritage && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#6b1426]" : "bg-[#a07817]"}`} />}
                    <span>{link.name}</span>
                    {link.badge && <span className="hidden xl:inline-block text-[9px] font-bold text-[#a07817] bg-amber-50 border border-amber-200/60 px-1 rounded uppercase tracking-tighter">
                        {link.badge}
                      </span>}
                  </Link>;
  })}

              <Link
    to="/download"
    className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#881930] to-[#5a1120] hover:from-[#6b1426] hover:to-[#4a0e1a] text-amber-200 hover:text-white rounded-full text-[11px] font-bold tracking-normal transition-all shadow-xs border border-amber-400/40 ml-auto"
    title="Download Complete MERN Stack Project (React, Node, Express, MongoDB)"
  >
                <Download className="w-3.5 h-3.5 text-[#f2ce6e]" />
                <span>MERN Project (.ZIP)</span>
              </Link>
            </nav>
          </div>
        </div>

        {
    /* Mobile Search Bar (Below Header on small screens) */
  }
        <div className="md:hidden border-t border-stone-200 px-4 py-2.5 bg-stone-50">
          <GlobalSearchBar variant="mobile" />
        </div>

        {
    /* Mobile Quick Category Ribbon: Instant 1-Tap Access to All Categories */
  }
        <div className="lg:hidden border-t border-stone-200/90 bg-[#FCF9F5] px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
            {categoryNavLinks.map((cat) => {
    const isActive = location.pathname + location.search === cat.href;
    return <Link
      key={cat.name}
      to={cat.href}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${isActive ? "bg-[#6b1426] text-white shadow-xs font-bold" : "bg-white text-stone-700 hover:bg-stone-100 hover:text-[#6b1426] border border-stone-200 shadow-2xs"}`}
    >
                  <span>{cat.name}</span>
                  {cat.badge && <span
      className={`text-[9px] px-1 rounded uppercase font-bold tracking-tight ${isActive ? "bg-[#f2ce6e] text-stone-900" : "bg-rose-50 text-[#881930]"}`}
    >
                      {cat.badge}
                    </span>}
                </Link>;
  })}
          </div>
        </div>

        {
    /* Mobile Navigation Drawer */
  }
        {mobileMenuOpen && <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
            {
    /* Mobile Deliver to Address Banner */
  }
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#881930] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold block uppercase">Deliver to</span>
                  <span className="text-xs font-bold text-stone-900 block truncate max-w-[170px]">
                    {defaultAddress ? `${defaultAddress.fullName} \xB7 ${defaultAddress.city} ${defaultAddress.pincode}` : "Add Address"}
                  </span>
                </div>
              </div>
              <button
    type="button"
    onClick={() => {
      setMobileMenuOpen(false);
      setIsAddressModalOpen(true);
    }}
    className="text-xs font-bold text-[#881930] hover:underline px-2.5 py-1 bg-white rounded-lg border border-rose-200 shadow-2xs"
  >
                {defaultAddress ? "Change" : "Add"}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 px-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#a07817]">
                  Category Pages
                </p>
                <span className="text-[10px] text-stone-400 font-medium">Authentic Handlooms</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {categoryNavLinks.map((link) => {
    const isPrimary = ["Banarasi Silk", "Kanjivaram Silk", "Chanderi & Organza", "Bridal Heritage"].includes(link.name);
    const isActive = location.pathname + location.search === link.href;
    return <Link
      key={link.name}
      to={link.href}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-[#6b1426] text-white font-bold shadow-xs" : isPrimary ? "text-stone-900 font-semibold hover:bg-rose-50 hover:text-[#6b1426]" : "text-stone-700 hover:bg-stone-50 hover:text-[#6b1426]"}`}
    >
                      <span className="flex items-center gap-2">
                        {isPrimary && <span
      className={`w-2 h-2 rounded-full ${isActive ? "bg-[#f2ce6e]" : "bg-[#881930]"}`}
    />}
                        <span>{link.name}</span>
                      </span>
                      {link.badge && <span
      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isActive ? "bg-[#f2ce6e] text-stone-950" : "bg-rose-100 text-[#881930]"}`}
    >
                          {link.badge}
                        </span>}
                    </Link>;
  })}
              </nav>
            </div>

            <div className="border-t border-stone-100 pt-3 space-y-1.5">
              {!isAuthenticated && <div className="grid grid-cols-2 gap-2 pb-1.5">
                  <Link
    to="/login"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#6b1426] text-white text-xs font-bold rounded-lg shadow-xs"
  >
                    <span>Sign In</span>
                  </Link>
                  <Link
    to="/register"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-50 text-[#881930] border border-rose-200 text-xs font-bold rounded-lg"
  >
                    <span>Register</span>
                  </Link>
                </div>}

              <Link
    to="/cart"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-600" />
                  <span>Shopping Bag</span>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded">
                  {totalItemsCount}
                </span>
              </Link>
              <Link
    to="/wishlist"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-stone-600" />
                  <span>Saved Sarees</span>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded">
                  {wishlistCount}
                </span>
              </Link>
              <Link
    to="/order-tracking"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 text-sm text-[#881930] font-semibold hover:bg-rose-50 rounded-md"
  >
                <Truck className="w-4 h-4 text-[#881930]" />
                <span>Track Order</span>
              </Link>
              <Link
    to="/profile"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <User className="w-4 h-4 text-stone-600" />
                <span>My Profile &amp; Orders</span>
              </Link>
              <Link
    to="/download"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-between px-3 py-2.5 text-sm font-bold text-[#4a0e1b] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs mt-1"
  >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#881930]" />
                  <span>Download MERN Project (.ZIP)</span>
                </div>
                <span className="text-[10px] bg-[#881930] text-white px-2 py-0.5 rounded font-mono uppercase">
                  ZIP
                </span>
              </Link>
            </div>
          </div>}
      </header>

      {
    /* Delivery Address Modal */
  }
      <AddressModalWithOtp
    isOpen={isAddressModalOpen}
    onClose={() => setIsAddressModalOpen(false)}
    onSuccess={() => setIsAddressModalOpen(false)}
    title="Delivery Address &amp; Contact Details"
  />
    </>;
};
