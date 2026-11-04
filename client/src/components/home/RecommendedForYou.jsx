import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  Flame
} from "lucide-react";
import { ProductCard } from "../products/ProductCard";
import {
  computeRecommendedProducts,
  getRecentlyViewedItems,
  clearRecentlyViewedHistory
} from "../../utils/recentViews";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
export const RecommendedForYou = ({
  allProducts,
  onQuickView
}) => {
  const [recommendationData, setRecommendationData] = useState({
    products: [],
    basedOnItem: null,
    rationale: "Curated royal weaves",
    hasViewHistory: false
  });
  const [recentItems, setRecentItems] = useState([]);
  const [activeTastePill, setActiveTastePill] = useState(null);
  const refreshRecommendations = () => {
    const recs = computeRecommendedProducts(allProducts, 4);
    setRecommendationData(recs);
    setRecentItems(getRecentlyViewedItems());
  };
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      refreshRecommendations();
    }
    const handleViewChange = () => {
      refreshRecommendations();
    };
    window.addEventListener("saree_viewed_changed", handleViewChange);
    return () => window.removeEventListener("saree_viewed_changed", handleViewChange);
  }, [allProducts]);
  const handleClearHistory = () => {
    clearRecentlyViewedHistory();
    toast.success("Browsing history cleared", { icon: "\u{1F9F9}" });
    refreshRecommendations();
  };
  const handleTasteFilter = (fabricOrCat) => {
    if (activeTastePill === fabricOrCat) {
      setActiveTastePill(null);
      refreshRecommendations();
      return;
    }
    setActiveTastePill(fabricOrCat);
    const filtered = allProducts.filter(
      (p) => p.fabric && p.fabric.toLowerCase().includes(fabricOrCat.toLowerCase()) || p.category && p.category.toLowerCase().includes(fabricOrCat.toLowerCase()) || p.occasion && p.occasion.toLowerCase().includes(fabricOrCat.toLowerCase())
    );
    setRecommendationData({
      products: filtered.slice(0, 4),
      basedOnItem: null,
      rationale: `Curated for your passion in ${fabricOrCat} drapes`,
      hasViewHistory: true
    });
  };
  if (!allProducts || allProducts.length === 0 || recommendationData.products.length === 0) {
    return null;
  }
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-8">
      {
    /* Container Card with Royal Accent Background */
  }
      <div className="bg-gradient-to-br from-amber-50/60 via-white to-rose-50/40 rounded-3xl p-6 sm:p-10 border border-amber-200/70 shadow-sm relative overflow-hidden">
        {
    /* Subtle decorative glow */
  }
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/20 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        {
    /* 1. Header with Personalization Context */
  }
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-amber-200/60 pb-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a07817]">
              <Sparkles className="w-3.5 h-3.5 text-[#881930]" />
              <span>Tailored for You</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              Recommended for You
            </h2>

            {
    /* Smart Rationale Indicator */
  }
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600">
              <span className="font-medium text-[#881930] flex items-center gap-1.5 bg-rose-50 border border-rose-200/60 px-2.5 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{recommendationData.rationale}</span>
              </span>

              {recommendationData.basedOnItem && <span className="text-stone-500 hidden sm:inline text-[11px]">
                  (Auto-tuned based on your recent clicks)
                </span>}
            </div>
          </div>

          {
    /* Controls: Quick Explore Taste Pills or Clear History */
  }
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {!recommendationData.hasViewHistory ? <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-stone-500 mr-1">Quick Taste:</span>
                {[
    { id: "Banarasi", label: "Banarasi Silk" },
    { id: "Kanjivaram", label: "Kanjivaram" },
    { id: "Bridal", label: "Bridal Red" },
    { id: "Chanderi", label: "Pastel Chanderi" }
  ].map((pill) => <button
    key={pill.id}
    onClick={() => handleTasteFilter(pill.id)}
    className={`py-1 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${activeTastePill === pill.id ? "bg-[#881930] text-white font-semibold shadow-xs" : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs"}`}
  >
                    {pill.label}
                  </button>)}
              </div> : <div className="flex items-center gap-3">
                <button
    onClick={handleClearHistory}
    className="text-xs text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
    title="Reset viewed history"
  >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset History</span>
                </button>

                <Link
    to="/products"
    className="py-1.5 px-3 bg-white hover:bg-stone-50 text-stone-800 hover:text-[#881930] text-xs font-semibold rounded-lg border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
  >
                  <span>View All Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>}
          </div>
        </div>

        {
    /* 2. Recently Viewed Mini Horizontal Tray (If user has history) */
  }
        {recentItems.length > 0 && <div className="pt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none relative z-10 border-b border-amber-100 mb-6">
            <span className="text-xs font-semibold text-stone-500 shrink-0 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Recently Viewed:</span>
            </span>
            <div className="flex items-center gap-2">
              {recentItems.slice(0, 5).map((item) => <div
    key={item.id}
    onClick={() => {
      const match = allProducts.find((p) => p.id === item.id);
      if (match && onQuickView) onQuickView(match);
    }}
    className="flex items-center gap-2 bg-white/80 hover:bg-white p-1.5 pr-3 rounded-xl border border-stone-200 hover:border-[#881930] text-left transition-all cursor-pointer shrink-0 shadow-2xs group"
  >
                  <img
    src={item.image}
    alt={item.name}
    className="w-7 h-9 object-cover object-top rounded-md border border-stone-200"
  />
                  <div className="max-w-[140px] truncate">
                    <p className="text-[11px] font-semibold text-stone-800 truncate group-hover:text-[#881930]">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.fabric}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>}

        {
    /* 3. 4-Column Product Recommendations Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 relative z-10">
          {recommendationData.products.map((product) => <ProductCard
    key={product.id}
    product={product}
    onQuickView={onQuickView}
  />)}
        </div>
      </div>
    </section>;
};
