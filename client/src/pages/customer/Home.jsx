import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Copy, Check, ShieldCheck, HeartHandshake, Download } from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { ProductCard } from "../../components/products/ProductCard";
import { QuickViewModal } from "../../components/products/QuickViewModal";
import { Button } from "../../components/common/Button";
import { Hero } from "../../components/home/Hero";
import { CustomerReviews } from "../../components/home/CustomerReviews";
import { RecommendedForYou } from "../../components/home/RecommendedForYou";
import { RecentlyViewedSection } from "../../components/home/RecentlyViewedSection";
import { NewsletterSection } from "../../components/home/NewsletterSection";
import toast from "react-hot-toast";
export const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    productService.getProducts().then(setProducts);
    categoryService.getCategories().then(setCategories);
  }, []);
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(null), 3e3);
  };
  const filteredShowcase = products.filter((p) => {
    if (activeTab === "bestsellers") return p.isBestSeller;
    if (activeTab === "new") return p.isNewArrival;
    return p.isFeatured;
  });
  return <div className="space-y-16 lg:space-y-24 pb-20">
      {
    /* 1. Hero Campaign Banner Slider */
  }
      <Hero />

      {
    /* MERN Architecture & Download Banner */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-gradient-to-r from-[#20070e] via-[#3a0d18] to-[#20070e] border-2 border-[#d4af37]/60 rounded-2xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f2ce6e] text-[11px] font-bold uppercase tracking-wider">
              <span>Pure MERN Stack Application</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
              Full Stack Source Code: React 19 + Node.js + Express + MongoDB
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Yeh website pure MERN stack (MongoDB, Express, React, Node.js) par banayi gayi hai. Aap ready-to-run source code file ko yahan se direct .ZIP download kar sakte hain.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
    href="/saree-sansar-mern-javascript.zip"
    download="saree-sansar-mern-javascript.zip"
    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ce6e] to-[#d4af37] text-[#2d0912] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
  >
              <Download className="w-4 h-4 text-[#881930]" />
              <span>Download MERN Project (.ZIP)</span>
            </a>
            <Link
    to="/download"
    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all text-center"
  >
              All Packages
            </Link>
          </div>
        </div>
      </div>

      {
    /* 3. Curated Weaving Regions / Categories */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
            Timeless Traditions
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
            Shop by Weaving Heritage
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Each region weaves a distinct legacy of motifs, borders, and pure artisanal poetry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => <Link
    key={cat.id}
    to={`/products?category=${cat.slug}`}
    className="group flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200/80 hover:border-[#881930] hover:shadow-md transition-all duration-300"
  >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 bg-stone-100 border-2 border-stone-200 group-hover:border-[#881930] transition-colors">
                <img
    src={cat.image}
    alt={cat.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />
              </div>
              <h3 className="font-medium text-stone-900 text-sm group-hover:text-[#6b1426] transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500 mt-0.5">
                {cat.productCount} Designs
              </span>
            </Link>)}
        </div>
      </section>

      {
    /* 3. Featured Showcase Grid (Anti-slop clean tabbed filter) */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
              Handcrafted Catalogue
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Ethnic Masterpieces
            </h2>
          </div>

          {
    /* Clean Segmented Tab Buttons */
  }
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg self-start sm:self-auto">
            <button
    onClick={() => setActiveTab("trending")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "trending" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              Trending Now
            </button>
            <button
    onClick={() => setActiveTab("bestsellers")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "bestsellers" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              Bestsellers
            </button>
            <button
    onClick={() => setActiveTab("new")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "new" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              New Drops
            </button>
          </div>
        </div>

        {
    /* 3-Column Product Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredShowcase.map((product) => <ProductCard
    key={product.id}
    product={product}
    onQuickView={setQuickViewProduct}
  />)}
        </div>

        <div className="mt-12 text-center">
          <Button
    onClick={() => navigate("/products")}
    variant="outline"
    size="lg"
    className="px-8"
  >
            <span>View All Sarees &amp; Fabrics</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {
    /* 4. Promotional Coupon Spotlight Banner (Warm Royal Ruby Palette - Balanced & Luminous) */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#5b1525] via-[#6e1c2e] to-[#450f1b] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#d4af37]/60">
          {
    /* Subtle gold ambient glow */
  }
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#f2ce6e]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#881930]/35 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-[#f2ce6e] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f2ce6e]" />
              Limited Festive Privileges
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3 text-white">
              Special Savings for Discerning Wardrobes
            </h3>
            <p className="text-sm text-stone-100 leading-relaxed mb-6">
              Apply these verified promotion codes during checkout to avail exclusive royal discounts with complimentary insured shipping.
            </p>

            <div className="flex flex-wrap gap-4">
              {
    /* Coupon 1 */
  }
              <div className="bg-black/40 backdrop-blur-md border-2 border-dashed border-[#f2ce6e]/80 rounded-xl p-3.5 flex items-center justify-between gap-4 min-w-[240px] shadow-md">
                <div>
                  <p className="font-mono text-base font-bold text-[#f2ce6e] tracking-wider">ROYAL15</p>
                  <p className="text-xs text-stone-200">15% off orders above ₹4,999</p>
                </div>
                <button
    onClick={() => handleCopyCode("ROYAL15")}
    className="p-2 hover:bg-white/10 rounded-lg text-amber-200 hover:text-white transition-colors cursor-pointer border border-[#f2ce6e]/30"
    title="Copy Code"
  >
                  {copiedCoupon === "ROYAL15" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {
    /* Coupon 2 */
  }
              <div className="bg-black/40 backdrop-blur-md border-2 border-dashed border-[#f2ce6e]/80 rounded-xl p-3.5 flex items-center justify-between gap-4 min-w-[240px] shadow-md">
                <div>
                  <p className="font-mono text-base font-bold text-[#f2ce6e] tracking-wider">FIRST10</p>
                  <p className="text-xs text-stone-200">10% off your maiden order</p>
                </div>
                <button
    onClick={() => handleCopyCode("FIRST10")}
    className="p-2 hover:bg-white/10 rounded-lg text-amber-200 hover:text-white transition-colors cursor-pointer border border-[#f2ce6e]/30"
    title="Copy Code"
  >
                  {copiedCoupon === "FIRST10" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 5. Recently Viewed Sarees: Last 5 Sarees in this Session */
  }
      <RecentlyViewedSection
    onQuickView={setQuickViewProduct}
    fallbackProducts={products}
  />

      {
    /* 6. Recommended For You: Personalized Matching Based on Recent Views */
  }
      <RecommendedForYou
    allProducts={products}
    onQuickView={setQuickViewProduct}
  />

      {
    /* 6. Craftsmanship & Ethical Artisanship Story */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
              Purity &amp; Heritage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              Every Thread Carries a Weaver&apos;s Soul and 500 Years of Heritage
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              At Saree Sansar, we work directly with certified artisan clusters in Varanasi, Kanchipuram, Chanderi, and Murshidabad. We eliminate middlemen to ensure our weavers receive fair wages and you receive 100% genuine Silk Mark certified weaves at honest boutique pricing.
            </p>
            <div className="space-y-2 pt-2 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#881930]" />
                <span>Certified Pure Mulberry and Katan Silks</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#881930]" />
                <span>Direct Artisan Profit Sharing Initiative</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 p-6 sm:p-8 rounded-2xl border border-amber-200/80 space-y-4">
            <span className="text-[11px] font-bold text-[#a07817] uppercase tracking-wider">
              Royal Handloom Authenticity Assurance
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
              100% Pure Silk &amp; Tested Zari Guarantee
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every saree is accompanied by the official Silk Mark of India certificate and the master weaver&apos;s guild details. Our sarees preserve their luster and elegance across generations.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-100 space-y-1">
                <span className="font-bold text-stone-900 font-mono">15-25 Days</span>
                <p className="text-[11px] text-stone-500">Handloom weaving time per drape</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100 space-y-1">
                <span className="font-bold text-stone-900 font-mono">2,400+ Artisans</span>
                <p className="text-[11px] text-stone-500">Champa, Varanasi &amp; Kanchi Looms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 6. Carousel-Style Customer Reviews & Social Proof Section */
  }
      <CustomerReviews />

      {
    /* 7. Maroon-950 Themed Royal Newsletter Section */
  }
      <NewsletterSection />

      {
    /* Quick View Modal */
  }
      <QuickViewModal
    product={quickViewProduct}
    isOpen={!!quickViewProduct}
    onClose={() => setQuickViewProduct(null)}
  />
    </div>;
};
