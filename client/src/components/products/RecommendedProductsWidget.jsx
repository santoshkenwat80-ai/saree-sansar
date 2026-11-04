import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Layers
} from "lucide-react";
import { productService } from "../../services/productService";
import { formatINR, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { SSAssuredBadge } from "./FlipkartFeatures";
import { QuickViewModal } from "./QuickViewModal";
import toast from "react-hot-toast";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
export const RecommendedProductsWidget = ({
  currentProduct,
  className = ""
}) => {
  const [recommendedList, setRecommendedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchRecommendations = async () => {
      try {
        const categoryProducts = await productService.getProducts({
          category: currentProduct.category
        });
        let combined = (categoryProducts || []).filter(
          (p) => p && p.id !== currentProduct.id
        );
        if (combined.length < 5) {
          const fabricProducts = await productService.getProducts({
            fabric: currentProduct.fabric
          });
          const extras = (fabricProducts || []).filter(
            (p) => p && p.id !== currentProduct.id && !combined.some((c) => c.id === p.id)
          );
          combined = [...combined, ...extras];
        }
        const scored = combined.map((p) => {
          let reason = `Recommended in ${currentProduct.category}`;
          let badgeColor = "bg-amber-100 text-amber-900 border-amber-200";
          if (p.rating >= 4.8) {
            reason = `Top Rated ${p.rating}\u2605 \xB7 Patron Favorite`;
            badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-200";
          } else if (p.fabric && currentProduct.fabric && p.fabric.toLowerCase() === currentProduct.fabric.toLowerCase()) {
            reason = `Pure ${p.fabric} Weave`;
            badgeColor = "bg-rose-100 text-[#881930] border-rose-200";
          } else if (Math.abs(p.price - currentProduct.price) < 5e3) {
            reason = `Similar Price Point`;
            badgeColor = "bg-blue-100 text-blue-900 border-blue-200";
          } else if (p.isBestSeller) {
            reason = `Best Seller in ${currentProduct.category}`;
            badgeColor = "bg-amber-100 text-amber-900 border-amber-300";
          }
          return {
            ...p,
            recommendationReason: reason,
            badgeColor
          };
        });
        if (isMounted) {
          setRecommendedList(scored);
          setFilteredList(scored);
        }
      } catch (err) {
        console.error("Failed to load recommended products for category", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, [currentProduct.id, currentProduct.category, currentProduct.fabric, currentProduct.price]);
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredList(recommendedList);
    } else if (activeTab === "top_rated") {
      setFilteredList(recommendedList.filter((p) => p.rating >= 4.5));
    } else if (activeTab === "price_match") {
      const min = currentProduct.price * 0.7;
      const max = currentProduct.price * 1.3;
      setFilteredList(recommendedList.filter((p) => p.price >= min && p.price <= max));
    } else if (activeTab === "same_fabric") {
      setFilteredList(
        recommendedList.filter(
          (p) => p.fabric && currentProduct.fabric && p.fabric.toLowerCase() === currentProduct.fabric.toLowerCase()
        )
      );
    }
  }, [activeTab, recommendedList, currentProduct.price, currentProduct.fabric]);
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };
  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error("This saree is currently out of stock");
      return;
    }
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to your bag!`, {
      icon: "\u{1F6CD}\uFE0F"
    });
  };
  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  if (!isLoading && recommendedList.length === 0) {
    return null;
  }
  return <section className={`mt-16 pt-12 border-t border-stone-200 ${className}`}>
      {
    /* Header Container */
  }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-[11px] font-bold text-[#881930] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Curated For Your Taste</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Recommended For You
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Based on your interest in{" "}
            <span className="font-semibold text-[#881930] underline decoration-[#d4af37]/60 underline-offset-2">
              {currentProduct.category}
            </span>{" "}
            sarees &amp; artisanal weaves
          </p>
        </div>

        {
    /* Carousel controls */
  }
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Link
    to={`/products?category=${encodeURIComponent(currentProduct.category)}`}
    className="text-xs font-bold text-[#881930] hover:text-[#520f1d] hover:underline flex items-center gap-1 mr-3"
  >
            <span>View All in {currentProduct.category}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
    type="button"
    onClick={() => handleScroll("left")}
    disabled={!canScrollLeft}
    aria-label="Scroll left"
    className="w-9 h-9 rounded-full border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
  >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
    type="button"
    onClick={() => handleScroll("right")}
    disabled={!canScrollRight}
    aria-label="Scroll right"
    className="w-9 h-9 rounded-full border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
  >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
    /* Filter Tabs / Quick Chips */
  }
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3 text-[#881930]" />
          Filter:
        </span>
        <button
    type="button"
    onClick={() => setActiveTab("all")}
    className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer ${activeTab === "all" ? "bg-[#881930] text-white shadow-2xs" : "bg-stone-100 hover:bg-stone-200 text-stone-700"}`}
  >
          All {currentProduct.category} ({recommendedList.length})
        </button>
        <button
    type="button"
    onClick={() => setActiveTab("top_rated")}
    className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${activeTab === "top_rated" ? "bg-[#881930] text-white shadow-2xs" : "bg-stone-100 hover:bg-stone-200 text-stone-700"}`}
  >
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>Top Rated (4.5★+)</span>
        </button>
        <button
    type="button"
    onClick={() => setActiveTab("same_fabric")}
    className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${activeTab === "same_fabric" ? "bg-[#881930] text-white shadow-2xs" : "bg-stone-100 hover:bg-stone-200 text-stone-700"}`}
  >
          <Layers className="w-3 h-3 text-amber-600" />
          <span>Same Fabric ({currentProduct.fabric})</span>
        </button>
        <button
    type="button"
    onClick={() => setActiveTab("price_match")}
    className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer ${activeTab === "price_match" ? "bg-[#881930] text-white shadow-2xs" : "bg-stone-100 hover:bg-stone-200 text-stone-700"}`}
  >
          Similar Price Range (±30%)
        </button>
      </div>

      {
    /* Loading Skeleton */
  }
      {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="animate-pulse bg-white border border-stone-200 rounded-xl p-3 space-y-3">
              <div className="h-56 bg-stone-200 rounded-lg w-full" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
              <div className="h-6 bg-stone-200 rounded w-1/3" />
            </div>)}
        </div>}

      {
    /* Products Carousel / Grid */
  }
      {!isLoading && <div
    ref={scrollContainerRef}
    onScroll={checkScroll}
    className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent"
    style={{ scrollbarWidth: "thin" }}
  >
          {filteredList.map((item) => {
    const isLiked = isInWishlist(item.id);
    const discount = calculateDiscount(item.originalPrice, item.price);
    const imgSrc = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image || heroBridalImg;
    return <div
      key={item.id}
      className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-white rounded-xl border border-stone-200 hover:border-[#881930]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden"
    >
                <div>
                  {
      /* Image Container with Badges & Overlays */
    }
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <Link to={`/product/${item.slug || item.id}`}>
                      <img
      src={imgSrc}
      alt={item.name}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
                    </Link>

                    {
      /* Recommendation Reason Pill */
    }
                    <div className="absolute top-2 left-2 max-w-[85%] z-10">
                      <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-2xs border truncate ${item.badgeColor}`}
    >
                        {item.recommendationReason}
                      </span>
                    </div>

                    {
      /* Wishlist Button */
    }
                    <button
      type="button"
      onClick={(e) => handleToggleWishlist(e, item)}
      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer shadow-2xs ${isLiked ? "bg-rose-50 text-rose-600" : "bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600"}`}
      aria-label={isLiked ? "Remove from wishlist" : "Save to wishlist"}
    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                    </button>

                    {
      /* Quick View Button (Reveals on Hover) */
    }
                    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedQuickViewProduct(item);
      }}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/85 hover:bg-stone-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
    >
                      <Eye className="w-3.5 h-3.5 text-[#f2ce6e]" />
                      <span>Quick View</span>
                    </button>

                    {
      /* Flipkart-style Green Rating Badge */
    }
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold shadow-2xs">
                        <span>{item.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                      </span>
                    </div>
                  </div>

                  {
      /* Body Details */
    }
                  <div className="p-3.5 space-y-1.5">
                    {
      /* Fabric & SS Assured Badge */
    }
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-medium truncate">{item.fabric}</span>
                      <SSAssuredBadge size="sm" />
                    </div>

                    {
      /* Product Name */
    }
                    <Link
      to={`/product/${item.slug || item.id}`}
      className="block font-serif text-sm font-bold text-stone-900 hover:text-[#881930] line-clamp-1 transition-colors"
      title={item.name}
    >
                      {item.name}
                    </Link>

                    {
      /* Pricing Row */
    }
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-serif text-base font-bold text-[#6b1426] font-mono tabular-nums">
                        {formatINR(item.price)}
                      </span>
                      {item.originalPrice > item.price && <span className="text-[11px] text-stone-400 line-through font-mono tabular-nums">
                          {formatINR(item.originalPrice)}
                        </span>}
                      {discount > 0 && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          {discount}% off
                        </span>}
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {item.blousePieceIncluded ? "0.8m Blouse Included" : "Saree 5.5m Drape"} · Free Insured Delivery
                    </p>
                  </div>
                </div>

                {
      /* Footer Action: Add to Bag */
    }
                <div className="p-3 pt-0">
                  <button
      type="button"
      onClick={(e) => handleQuickAdd(e, item)}
      disabled={item.stock <= 0}
      className="w-full py-2 px-3 rounded-lg border border-[#881930] text-[#881930] hover:bg-[#881930] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#881930] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group/btn"
    >
                    <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span>{item.stock > 0 ? "Add to Bag" : "Out of Stock"}</span>
                  </button>
                </div>
              </div>;
  })}

          {
    /* End Card: View full category */
  }
          <div className="w-[200px] sm:w-[220px] shrink-0 snap-start bg-gradient-to-b from-[#fbf6ee] to-[#f4ebe0] rounded-xl border-2 border-dashed border-[#d4af37]/60 flex flex-col items-center justify-center p-6 text-center group hover:border-[#881930] transition-colors">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#881930] mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-[#d4af37]" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#4a0e1b] mb-1">
              Explore More
            </h3>
            <p className="text-[11px] text-stone-600 mb-4">
              Discover all designs in the {currentProduct.category} collection
            </p>
            <Link
    to={`/products?category=${encodeURIComponent(currentProduct.category)}`}
    className="px-3.5 py-2 rounded-lg bg-[#881930] hover:bg-[#6b1426] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
  >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>}

      {
    /* Quick View Modal for Recommended Items */
  }
      {selectedQuickViewProduct && <QuickViewModal
    product={selectedQuickViewProduct}
    isOpen={Boolean(selectedQuickViewProduct)}
    onClose={() => setSelectedQuickViewProduct(null)}
  />}
    </section>;
};
