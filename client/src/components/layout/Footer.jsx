import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Sparkles,
  CheckCircle,
  Download
} from "lucide-react";
import { NewsletterSignup } from "../common/NewsletterSignup";
export const PinterestIcon = ({ className = "w-4 h-4" }) => <svg
  viewBox="0 0 24 24"
  fill="currentColor"
  className={className}
  aria-hidden="true"
>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12C24.017 5.367 18.644 0 12.017 0z" />
  </svg>;
export const Footer = () => {
  const [policyModal, setPolicyModal] = useState(null);
  const openPolicy = (title, content) => {
    setPolicyModal({ title, content });
  };
  return <footer className="bg-[#332c28] text-stone-200 border-t border-stone-700/70">
      {
    /* 1. Trust Pillars Strip (Warm, Gentle Tone) */
  }
      <div className="border-b border-stone-700/60 py-6 bg-[#3d3632]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/20 border border-[#f2ce6e]/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#f2ce6e]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Silk Mark Certified</h4>
                <p className="text-[11px] text-stone-300">100% Pure Natural Handloom Silk</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/20 border border-[#f2ce6e]/30 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#f2ce6e]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-[11px] text-stone-300">Pan-India delivery on orders above ₹2,000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/20 border border-[#f2ce6e]/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-[#f2ce6e]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">7-Day Easy Returns</h4>
                <p className="text-[11px] text-stone-300">Doorstep pickup &amp; exchange policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/20 border border-[#f2ce6e]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#f2ce6e]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Secure Checkout</h4>
                <p className="text-[11px] text-stone-300">UPI, Cards, NetBanking &amp; COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* 2. DEDICATED SECTION: 'Subscribe to our Newsletter' for Promotional Saree Collections */
  }
      <section
    aria-label="Subscribe to our Newsletter"
    className="border-b border-stone-700/60 bg-[#2d2622] py-10 sm:py-14 relative overflow-hidden"
  >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-gradient-to-br from-[#3b312b] via-[#332a24] to-[#28211d] border border-amber-500/35 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>

      {
    /* 3. Main 4-Column Clean Navigation Grid */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {
    /* Column 1: Brand Story & Direct Contact (4 cols) */
  }
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#881930] to-[#5a1120] text-[#f2ce6e] flex items-center justify-center border border-[#d4af37]/50 shadow-md shrink-0">
                <span className="font-serif text-lg font-bold">MD</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#f2ce6e] group-hover:text-amber-200 transition-colors whitespace-nowrap">
                  Maheshram Dewangan &amp; Bros.
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-amber-200 font-semibold mt-1">
                  Handloom Tussar Silk · Champa (C.G.)
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Authentic Indian handlooms sourced directly from master weaving guilds in Champa, Varanasi, and Kanchipuram. We celebrate centuries of textile art with genuine Silk Mark purity.
            </p>

            {
    /* Direct Manufacturer & Contact Info */
  }
            <div className="pt-1 text-xs text-stone-300 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f2ce6e] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Looms:</strong> Gowshala Road, Champa - 495671 (C.G.)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f2ce6e] shrink-0" />
                <a href="tel:09425505875" className="hover:text-[#f2ce6e] transition-colors">
                  +91 94255 05875 / 07819-245152
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f2ce6e] shrink-0" />
                <a href="mailto:maheshramdewangan1@gmail.com" className="hover:text-[#f2ce6e] transition-colors">
                  maheshramdewangan1@gmail.com
                </a>
              </div>
            </div>

            {
    /* WhatsApp Quick Chat & Social Links */
  }
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              <a
    href="https://wa.me/919425505875?text=Hello%20Saree%20Sansar,%20I%20have%20an%20inquiry%20about%20Handloom%20Sarees."
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
  >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-stone-700/60 hover:bg-pink-600 hover:text-white text-stone-300 flex items-center justify-center transition-colors"
    aria-label="Instagram"
  >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-stone-700/60 hover:bg-blue-600 hover:text-white text-stone-300 flex items-center justify-center transition-colors"
    aria-label="Facebook"
  >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              <a
    href="https://pinterest.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-stone-700/60 hover:bg-red-600 hover:text-white text-stone-300 flex items-center justify-center transition-colors"
    aria-label="Pinterest"
  >
                <PinterestIcon className="w-3.5 h-3.5" />
              </a>

              <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-stone-700/60 hover:bg-red-600 hover:text-white text-stone-300 flex items-center justify-center transition-colors"
    aria-label="YouTube"
  >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {
    /* Column 2: Collections (2.5 cols) */
  }
          <div className="lg:col-span-2 sm:pl-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <Link to="/products?category=tussar-silk" className="hover:text-[#f2ce6e] transition-colors">
                  Tussar Kosa Silk
                </Link>
              </li>
              <li>
                <Link to="/products?category=banarasi-silk" className="hover:text-[#f2ce6e] transition-colors">
                  Banarasi Katan Silk
                </Link>
              </li>
              <li>
                <Link to="/products?category=kanjivaram-silk" className="hover:text-[#f2ce6e] transition-colors">
                  Kanchipuram Silk
                </Link>
              </li>
              <li>
                <Link to="/products?category=chanderi-organza" className="hover:text-[#f2ce6e] transition-colors">
                  Chanderi &amp; Organza
                </Link>
              </li>
              <li>
                <Link to="/products?category=georgette-chiffon" className="hover:text-[#f2ce6e] transition-colors">
                  Khaddi Georgette
                </Link>
              </li>
              <li>
                <Link to="/products?category=bridal-heritage" className="hover:text-[#f2ce6e] transition-colors">
                  Bridal Heritage
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#f2ce6e] font-semibold hover:underline">
                  View All Sarees &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Column 3: Customer Support (2.5 cols) */
  }
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <Link to="/order-tracking" className="hover:text-[#f2ce6e] transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#f2ce6e] transition-colors">
                  My Profile &amp; Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#f2ce6e] transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "7-Day Easy Returns & Exchange",
      "We provide 7-day doorstep return and exchange on all unworn sarees in original luxury packaging with the Silk Mark tag intact."
    )}
    className="hover:text-[#f2ce6e] transition-colors text-left cursor-pointer"
  >
                  Returns &amp; Exchange
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Shipping & Delivery Policy",
      "Complimentary insured express shipping across India via BlueDart on orders above \u20B92,000. Typical transit time is 3 to 5 business days."
    )}
    className="hover:text-[#f2ce6e] transition-colors text-left cursor-pointer"
  >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Privacy & Payment Security",
      "Your data is secured with enterprise 256-bit TLS encryption. Payments are processed securely via RBI-licensed Razorpay gateway."
    )}
    className="hover:text-[#f2ce6e] transition-colors text-left cursor-pointer"
  >
                  Privacy Policy
                </button>
              </li>
              <li className="pt-1">
                <Link
    to="/download"
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f2ce6e] hover:text-white bg-[#3d342f] hover:bg-[#4a3f39] px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
  >
                  <Download className="w-3.5 h-3.5 text-[#f2ce6e]" />
                  <span>Download MERN Source (.ZIP)</span>
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Column 4: Artisan Heritage & Guarantees (3 cols) */
  }
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f2ce6e]" />
              Artisan Guild &amp; Purity
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every saree at Saree Sansar arrives with an authentic Silk Mark tag, direct from master weavers in Champa (Chhattisgarh) &amp; Varanasi.
            </p>

            <div className="bg-[#2a2420] p-3.5 rounded-xl border border-stone-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>100% Tested Zari &amp; Pure Mulberry/Kosa Silk</span>
              </div>
              <p className="text-[11px] text-stone-400">
                GST Registered &amp; Certified Handloom. Fair pricing directly supporting weaver families.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-amber-200/80 border-t border-stone-700/60 font-mono">
                <span>MFR: CHMP-CG-495671</span>
                <span>GSTIN: 22ACWPD7659Q2ZN</span>
              </div>
            </div>
          </div>
        </div>

        {
    /* 4. Bottom Legal & Copyright Bar */
  }
        <div className="border-t border-stone-700/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p className="text-center sm:text-left text-stone-300">
            © {(/* @__PURE__ */ new Date()).getFullYear()} Saree Sansar · Mfr: Maheshram Dewangan &amp; Bros., Champa (C.G.)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-amber-200/90 font-medium">
            <span>Silk Mark Certified</span>
            <span>·</span>
            <span>Handloom Mark</span>
            <span>·</span>
            <span>GSTIN: 22ACWPD7659Q2ZN</span>
            <span>·</span>
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>

      {
    /* Policy Details Modal Dialog */
  }
      {policyModal && <div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    onClick={() => setPolicyModal(null)}
  >
          <div
    className="bg-white border border-[#d4af37]/50 text-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
    onClick={(e) => e.stopPropagation()}
  >
            <h3 className="font-serif text-lg font-bold text-[#881930] mb-3">
              {policyModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
              {policyModal.content}
            </p>
            <div className="flex justify-end">
              <button
    type="button"
    onClick={() => setPolicyModal(null)}
    className="px-4 py-2 bg-[#881930] text-white text-xs font-semibold rounded-lg hover:bg-[#6b1426] transition-colors cursor-pointer"
  >
                Close
              </button>
            </div>
          </div>
        </div>}
    </footer>;
};
export default Footer;
