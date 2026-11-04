import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Eye } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { QuickViewModal } from "../../components/products/QuickViewModal";
export const Wishlist = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  if (wishlistCount === 0) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
      title="Your Wishlist is Empty"
      description="You haven't saved any heirloom sarees yet. Explore our royal catalogues and click the heart icon on any saree to save it for later."
      actionText="Browse Handlooms"
      onAction={() => navigate("/products")}
    />
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Saved Sarees &amp; Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlistCount} {wishlistCount === 1 ? "saree" : "sarees"} saved
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
    onClick={() => {
      wishlist.forEach((p) => addToCart(p, 1));
      wishlist.forEach((p) => removeFromWishlist(p.id));
    }}
    variant="secondary"
    size="sm"
  >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            <span>Move All to Bag</span>
          </Button>
          <Button
    onClick={() => navigate("/products")}
    variant="outline"
    size="sm"
  >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => <div
    key={product.id}
    onClick={() => setQuickViewProduct(product)}
    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
  >
            <div className="relative aspect-3/4 bg-stone-100 overflow-hidden">
              <img
    src={product.images[0]}
    alt={product.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    referrerPolicy="no-referrer"
  />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setQuickViewProduct(product);
    }}
    className="p-1.5 bg-white/90 rounded-full hover:bg-stone-100 text-stone-700 transition-colors shadow-xs"
    title="Quick View"
  >
                  <Eye className="w-3.5 h-3.5 text-[#881930]" />
                </button>
                <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      removeFromWishlist(product.id);
    }}
    className="p-1.5 bg-white/90 rounded-full hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors shadow-xs"
    title="Remove from wishlist"
  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#a07817] uppercase tracking-wider">
                  {product.fabric}
                </span>
                <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 mt-0.5 group-hover:text-[#881930] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                      {formatINR(product.originalPrice)}
                    </span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
    onClick={(e) => {
      e.stopPropagation();
      setQuickViewProduct(product);
    }}
    variant="outline"
    size="sm"
    className="w-full text-xs"
  >
                  <Eye className="w-3.5 h-3.5 mr-1 text-[#881930]" />
                  <span>Quick View</span>
                </Button>
                <Button
    onClick={(e) => {
      e.stopPropagation();
      addToCart(product, 1);
      removeFromWishlist(product.id);
    }}
    size="sm"
    className="w-full text-xs"
  >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  <span>To Bag</span>
                </Button>
              </div>
            </div>
          </div>)}
      </div>

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
