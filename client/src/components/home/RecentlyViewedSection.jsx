import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Trash2,
  Eye,
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
  X,
  Clock
} from "lucide-react";
import {
  getSessionRecentlyViewed,
  clearSessionRecentlyViewed,
  removeSessionRecentlyViewedItem,
  recordProductView,
  MAX_SESSION_RECENTLY_VIEWED
} from "../../utils/recentViews";
import { formatINR } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import toast from "react-hot-toast";
export const RecentlyViewedSection = ({
  onQuickView,
  fallbackProducts = []
}) => {
  const [viewedSarees, setViewedSarees] = useState([]);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const loadViewed = () => {
    const items = getSessionRecentlyViewed();
    setViewedSarees(items);
  };
  useEffect(() => {
    loadViewed();
    const handleUpdate = () => {
      loadViewed();
    };
    window.addEventListener("saree_session_recently_viewed_changed", handleUpdate);
    return () => {
      window.removeEventListener("saree_session_recently_viewed_changed", handleUpdate);
    };
  }, []);
  const handleClear = () => {
    clearSessionRecentlyViewed();
    toast.success("Session browsing history cleared", {
      icon: "\u{1F9F9}",
      duration: 2500
    });
  };
  const handleRemoveItem = (e, productId, name) => {
    e.preventDefault();
    e.stopPropagation();
    removeSessionRecentlyViewedItem(productId);
    toast.success(`Removed "${name}" from session history`, {
      duration: 2e3
    });
  };
  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error("This saree is currently out of stock");
      return;
    }
    addToCart(product, 1);
    toast.success(`"${product.name}" added to your bag!`, {
      icon: "\u{1F6CD}\uFE0F",
      duration: 2500
    });
  };
  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  const formatViewedTime = (timestamp) => {
    if (!timestamp) return "This session";
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 6e4);
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };
  if (viewedSarees.length === 0) {
    const starterSuggestions = fallbackProducts.slice(0, 3);
    return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="recently-viewed-section">
        <div className="bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 rounded-2xl border border-stone-200/90 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#881930]/10 text-[#881930] text-xs font-semibold uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-[#881930]" />
                <span>Session Browsing History</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Recently Viewed Sarees
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                As you explore our collection, the last 5 sarees you view during this session will be preserved right here for quick drape comparison.
              </p>
            </div>

            {starterSuggestions.length > 0 && <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-xs text-stone-500 font-medium">Start exploring:</span>
                <div className="flex flex-wrap gap-2">
                  {starterSuggestions.map((prod) => <button
      key={prod.id}
      onClick={() => {
        recordProductView(prod);
        if (onQuickView) onQuickView(prod);
      }}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg shadow-xs transition-colors cursor-pointer"
    >
                      <span>{prod.name.split(" ").slice(0, 2).join(" ")}</span>
                      <ArrowRight className="w-3 h-3 text-[#881930]" />
                    </button>)}
                </div>
              </div>}
          </div>
        </div>
      </section>;
  }
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="recently-viewed-section">
      {
    /* Section Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#881930]/10 text-[#881930] text-xs font-semibold uppercase tracking-wider mb-1.5">
            <History className="w-3.5 h-3.5 text-[#881930]" />
            <span>Session History · Last {viewedSarees.length} of {MAX_SESSION_RECENTLY_VIEWED} Sarees</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Recently Viewed Sarees
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Revisit your favorite handlooms from this session before your drape selections are cleared.
          </p>
        </div>

        {
    /* Clear Button & Counter */
  }
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
            {viewedSarees.length}/{MAX_SESSION_RECENTLY_VIEWED} in session
          </span>
          <button
    onClick={handleClear}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-[#881930] hover:bg-rose-50 border border-stone-200 hover:border-[#881930]/30 rounded-lg transition-colors cursor-pointer"
    title="Clear recently viewed sarees for this session"
  >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {
    /* Saree Cards Grid (Capped at 5) */
  }
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {viewedSarees.map((saree) => {
    const discount = saree.originalPrice && saree.originalPrice > saree.price ? Math.round((saree.originalPrice - saree.price) / saree.originalPrice * 100) : saree.discountPercent || 0;
    const isLiked = isInWishlist(saree.id);
    const sareeImage = Array.isArray(saree.images) && saree.images.length > 0 ? saree.images[0] : saree.image || heroBridalImg;
    return <div
      key={saree.id}
      className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col hover:border-[#881930]/50 hover:shadow-lg transition-all duration-300"
    >
              {
      /* Image Container with Badges */
    }
              <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
                <Link to={`/product/${saree.slug}`} className="block w-full h-full">
                  <img
      src={sareeImage}
      alt={saree.name}
      loading="lazy"
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80";
      }}
    />
                </Link>

                {
      /* Remove from history button */
    }
                <button
      onClick={(e) => handleRemoveItem(e, saree.id, saree.name)}
      className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-stone-500 hover:text-rose-600 hover:bg-white shadow-xs transition-colors cursor-pointer z-10"
      title="Remove from history"
    >
                  <X className="w-3.5 h-3.5" />
                </button>

                {
      /* Time Badge (Light Luxury Pill) */
    }
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-stone-800 border border-stone-200/90 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                  <Clock className="w-2.5 h-2.5 text-[#881930]" />
                  <span>{formatViewedTime(saree.viewedAt)}</span>
                </div>

                {
      /* Discount Tag */
    }
                {discount > 0 && <div className="absolute bottom-2 left-2 bg-[#881930] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    {discount}% OFF
                  </div>}

                {
      /* Quick Action Overlay (Desktop) */
    }
                <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {onQuickView && <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView(saree);
      }}
      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-medium rounded shadow-md transition-colors cursor-pointer"
      title="Quick View Saree"
    >
                      <Eye className="w-3.5 h-3.5 text-[#881930]" />
                      <span>Quick View</span>
                    </button>}
                  <button
      onClick={(e) => handleToggleWishlist(e, saree)}
      className={`p-1.5 rounded shadow-md transition-colors cursor-pointer ${isLiked ? "bg-rose-50 text-rose-600" : "bg-white/95 hover:bg-white text-stone-700 hover:text-rose-600"}`}
      title={isLiked ? "In Wishlist" : "Add to Wishlist"}
    >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {
      /* Saree Metadata */
    }
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] text-[#a07817] font-medium">
                    <span className="truncate">{saree.fabric || "Pure Handloom"}</span>
                    <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-emerald-700">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Silk Mark</span>
                    </span>
                  </div>

                  <Link
      to={`/product/${saree.slug}`}
      className="font-serif text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#881930] transition-colors line-clamp-2 mt-0.5"
      title={saree.name}
    >
                    {saree.name}
                  </Link>
                </div>

                {
      /* Pricing & Add To Bag */
    }
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm font-mono tabular-nums">
                      {formatINR(saree.price)}
                    </span>
                    {saree.originalPrice && saree.originalPrice > saree.price && <span className="text-[10px] text-stone-400 line-through ml-1 font-mono tabular-nums">
                        {formatINR(saree.originalPrice)}
                      </span>}
                  </div>

                  <button
      onClick={(e) => handleQuickAdd(e, saree)}
      className="p-1.5 rounded-md bg-[#881930] hover:bg-[#6b1426] text-white transition-colors cursor-pointer shrink-0"
      title="Add to Bag"
      aria-label={`Add ${saree.name} to shopping bag`}
    >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>;
  })}
      </div>
    </section>;
};
