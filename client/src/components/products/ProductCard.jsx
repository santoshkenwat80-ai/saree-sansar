import { useState } from "react";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { formatINR } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { QuickViewModal } from "./QuickViewModal";
import { SSAssuredBadge } from "./FlipkartFeatures";
import toast from "react-hot-toast";
export const ProductCard = ({
  product,
  onQuickView
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const [isLocalQuickViewOpen, setIsLocalQuickViewOpen] = useState(false);
  const isLiked = isInWishlist(product.id);
  const handleOpenQuickView = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onQuickView) {
      onQuickView(product);
    } else {
      setIsLocalQuickViewOpen(true);
    }
  };
  const handleQuickAdd = (e) => {
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
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  return <>
      <div
    onClick={handleOpenQuickView}
    className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#881930]/40 cursor-pointer select-none"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenQuickView();
      }
    }}
    aria-label={`Quick view details for ${product.name}`}
  >
        {
    /* Visual Slot / Imagery */
  }
        <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
          <img
    src={product.images[0]}
    alt={product.name}
    referrerPolicy="no-referrer"
    loading="lazy"
    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
    onError={(e) => {
      const target = e.currentTarget;
      target.onerror = null;
      target.style.display = "none";
      const parent = target.parentElement;
      if (parent) {
        parent.classList.add("bg-stone-200", "flex", "items-center", "justify-center");
        parent.innerHTML = `<span class="text-stone-500 font-serif text-sm">Saree Sansar Handloom</span>`;
      }
    }}
  />

          {
    /* Subtle Badges */
  }
          {product.isBestSeller ? <div className="absolute top-3 left-3 bg-[#881930] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Bestseller
            </div> : product.isNewArrival ? <div className="absolute top-3 left-3 bg-white text-[#881930] border border-[#881930]/30 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
              New Drop
            </div> : null}

          {
    /* Top-Right Action Buttons: Wishlist & Quick View */
  }
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {
    /* Quick View Button (Top Right) */
  }
            <button
    type="button"
    onClick={handleOpenQuickView}
    className="p-2 rounded-full bg-white/95 text-stone-700 hover:text-[#6b1426] hover:bg-white transition-all duration-200 shadow-sm cursor-pointer backdrop-blur-xs"
    title="Quick View"
    aria-label="Quick View"
  >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {
    /* Wishlist Button */
  }
            <button
    type="button"
    onClick={handleToggleWishlist}
    className={`p-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer backdrop-blur-xs ${isLiked ? "bg-rose-50 text-rose-600" : "bg-white/95 text-stone-700 hover:text-rose-600 hover:bg-white"}`}
    title={isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
    aria-label="Wishlist"
  >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-rose-600" : ""}`} />
            </button>
          </div>

          {
    /* Hover Overlay Button: Quick View Banner */
  }
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 z-10">
            <button
    type="button"
    onClick={handleOpenQuickView}
    className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-stone-900 hover:text-[#6b1426] text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-stone-200 backdrop-blur-xs"
    title="Quick View Details"
  >
              <Eye className="w-3.5 h-3.5 text-[#881930]" />
              <span>Quick View</span>
            </button>

            <button
    type="button"
    onClick={handleQuickAdd}
    className="py-2 px-3.5 bg-[#6b1426] text-white text-xs font-semibold rounded-xl shadow-lg hover:bg-[#520f1d] flex items-center justify-center gap-1 cursor-pointer transition-colors"
    title="Quick Add to Bag"
    aria-label="Quick Add to Bag"
  >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {
    /* Product Content Details */
  }
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {
    /* Metadata clean text with Flipkart Assured */
  }
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[#a07817]">
                {product.fabric}
              </span>
              <SSAssuredBadge size="sm" />
            </div>

            {
    /* Title */
  }
            <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#6b1426] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {
    /* Flipkart-style Green Rating Badge & Free Delivery */
  }
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                <span>{product.rating}</span>
                <Star className="w-2.5 h-2.5 fill-white text-white" />
              </span>
              <span className="text-[11px] text-stone-400 font-medium">({product.reviewsCount})</span>
              <span className="text-stone-300">·</span>
              <span className="text-[10px] text-emerald-800 font-semibold">Free delivery</span>
            </div>

            {(product.weavingTechnique || product.specifications?.Weave) && <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a07817]" />
                <span className="truncate">
                  {product.weavingTechnique || product.specifications?.Weave}
                </span>
              </div>}
          </div>

          {
    /* Price Row with Tabular Numerals */
  }
          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>}
            </div>
            {product.discountPercent > 0 && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                {product.discountPercent}% OFF
              </span>}
          </div>

          {
    /* Action Row: Quick View Link & Add to Bag */
  }
          <div className="pt-1 grid grid-cols-2 gap-2">
            <button
    type="button"
    onClick={handleOpenQuickView}
    className="w-full py-2 px-2 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
  >
              <Eye className="w-3.5 h-3.5 text-[#881930]" />
              <span>Details</span>
            </button>

            <button
    type="button"
    onClick={handleQuickAdd}
    className="w-full py-2 px-2 bg-[#6b1426] hover:bg-[#520f1d] active:bg-[#3d0b16] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
    aria-label={`Add ${product.name} to Shopping Bag`}
  >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Local fallback modal if parent didn't provide onQuickView */
  }
      {!onQuickView && <QuickViewModal
    product={product}
    isOpen={isLocalQuickViewOpen}
    onClose={() => setIsLocalQuickViewOpen(false)}
  />}
    </>;
};
