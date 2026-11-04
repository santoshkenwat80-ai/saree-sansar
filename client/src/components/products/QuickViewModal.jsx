import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ExternalLink,
  Layers,
  Scissors,
  MapPin,
  Camera,
  Ruler
} from "lucide-react";
import { formatINR, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Button } from "../common/Button";
import { SizeGuideModal } from "../common/SizeGuideModal";
import { SareeImageMagnifier } from "./SareeImageMagnifier";
import { VirtualTryOnModal } from "./VirtualTryOnModal";
import { lookupPincode } from "../../utils/pincode";
import { recordProductView } from "../../utils/recentViews";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import toast from "react-hot-toast";
export const QuickViewModal = ({
  product,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedJustNow, setAddedJustNow] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("492001");
  const [pincodeCity, setPincodeCity] = useState("Raipur, Chhattisgarh");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  useEffect(() => {
    if (product) {
      const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [heroBridalImg];
      setSelectedImage(imgs[0] || "");
      setQuantity(1);
      setAddedJustNow(false);
      if (isOpen) {
        recordProductView(product);
      }
    }
  }, [product, isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen || !product) return null;
  const productImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [heroBridalImg];
  const isLiked = isInWishlist(product.id);
  const discountVal = calculateDiscount(product.originalPrice, product.price);
  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedJustNow(true);
    toast.success(`${product.name} (${quantity} saree) added to bag!`, {
      icon: "\u{1F6CD}\uFE0F",
      duration: 3e3
    });
  };
  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    onClose();
    navigate("/checkout");
  };
  const handleViewFullProduct = () => {
    onClose();
    navigate(`/products/${product.slug}`);
  };
  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    const clean = pincodeInput.replace(/\D/g, "").slice(0, 6);
    if (clean.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }
    setIsCheckingPincode(true);
    try {
      const data = await lookupPincode(clean);
      if (data) {
        setPincodeCity(`${data.city}, ${data.state}`);
        toast.success(`Delivery available to ${data.city} (3-4 business days)`, { icon: "\u{1F69A}" });
      } else {
        setPincodeCity("Delivery available to all Indian PIN codes");
        toast.success("Delivery available via Express Insured Courier", { icon: "\u{1F69A}" });
      }
    } finally {
      setIsCheckingPincode(false);
    }
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      {
    /* Backdrop */
  }
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
    onClick={onClose}
    aria-hidden="true"
  />

        {
    /* Modal Dialog Card */
  }
        <div
    className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl my-4 border border-stone-200 z-10 animate-scale-in"
    onClick={(e) => e.stopPropagation()}
  >
          {
    /* Top Close Button */
  }
          <button
    type="button"
    onClick={onClose}
    className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm cursor-pointer border border-stone-200"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>

          {
    /* Quick View Grid: Visual Gallery (Left) & Product Details / Add to Bag (Right) */
  }
          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] md:max-h-[88vh] overflow-y-auto">
            {
    /* Left: Gallery & Imagery (Col 1-5) */
  }
            <div className="md:col-span-5 bg-stone-50 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
              <div className="space-y-3">
                {
    /* Main Large Image Frame with Saree Magnifier */
  }
                <SareeImageMagnifier
    src={selectedImage || productImages[0] || ""}
    alt={product.name}
    fabricName={product.fabric}
    silkMark={true}
  />

                {
    /* Thumbnails if multiple images exist */
  }
                {productImages.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1">
                    {productImages.map((img, idx) => <button
    type="button"
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`w-14 h-18 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${(selectedImage || productImages[0]) === img ? "border-[#881930] shadow-sm ring-1 ring-[#881930]" : "border-transparent opacity-70 hover:opacity-100"}`}
  >
                        <img
    src={img}
    alt={`${product.name} view ${idx + 1}`}
    className="w-full h-full object-cover object-top"
    referrerPolicy="no-referrer"
  />
                      </button>)}
                  </div>}
              </div>

              {
    /* Artisan Note */
  }
              <div className="mt-4 pt-3 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
                <span>Origin: {product.specifications?.Origin || "Varanasi Handloom"}</span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>
            </div>

            {
    /* Right: Product Details & Add to Bag (Col 6-12) */
  }
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {
    /* Category & Fabric Header */
  }
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#a07817] uppercase tracking-wider mb-1">
                    <span>{product.fabric}</span>
                    {product.weavingTechnique && <>
                        <span>•</span>
                        <span>{product.weavingTechnique}</span>
                      </>}
                  </div>

                  {
    /* Product Title with Link */
  }
                  <h2
    onClick={handleViewFullProduct}
    className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug hover:text-[#881930] cursor-pointer transition-colors"
  >
                    {product.name}
                  </h2>

                  {
    /* Rating & Patron reviews */
  }
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => <Star
    key={i}
    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-current" : "text-stone-300"}`}
  />)}
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-800">
                      {product.rating}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({product.reviewsCount} verified reviews)
                    </span>
                  </div>
                </div>

                {
    /* Price Display */
  }
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1426] font-mono tabular-nums">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice > product.price && <span className="text-xs sm:text-sm text-stone-400 line-through font-mono tabular-nums">
                        {formatINR(product.originalPrice)}
                      </span>}
                    {discountVal > 0 && <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Save {discountVal}%
                      </span>}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    GST Inclusive · Free Insured Express Delivery across India
                  </p>
                </div>

                {
    /* Short Description */
  }
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {
    /* Key Specifications Grid */
  }
                <div className="text-xs text-stone-700 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#a07817]" />
                      <span>
                        Saree: <strong className="font-semibold text-stone-900">{product.sareeLength?.split(" ")[0] || "5.5"}m</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#a07817]" />
                      <span>
                        Blouse: <strong className="font-semibold text-stone-900">{product.blousePieceIncluded ? "0.8m Included" : "Available separately"}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600 border-t border-stone-200/60 pt-1.5">
                    <span className="truncate">
                      Color: <strong className="font-medium text-stone-900">{product.color}</strong> · Zari: <strong className="font-medium text-stone-900">{product.specifications?.Zari || "Pure Zari"}</strong>
                    </span>
                    <button
    type="button"
    onClick={() => setIsSizeGuideOpen(true)}
    className="inline-flex items-center gap-1 font-bold text-[#881930] hover:text-[#520f1d] hover:underline cursor-pointer shrink-0 ml-2"
  >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                </div>

                {
    /* Stock Indicator */
  }
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
                    Stock Status
                  </span>
                  {product.stock > 0 ? <span className="font-medium text-emerald-700 flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      {product.stock <= 5 ? `Only ${product.stock} sarees left!` : "In Stock (Dispatched in 24 hours)"}
                    </span> : <span className="font-medium text-rose-600">Currently Out of Stock</span>}
                </div>

                {
    /* Delivery Pincode Check Mini-Form */
  }
                <div className="p-2.5 bg-stone-50/70 rounded-xl border border-stone-200 text-xs">
                  <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#881930] shrink-0" />
                    <span className="text-stone-600 shrink-0 text-[11px]">Check PIN Code:</span>
                    <input
    type="text"
    maxLength={6}
    value={pincodeInput}
    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
    placeholder="Enter 6-digit PIN"
    className="w-28 px-2 py-1 text-xs border border-stone-300 rounded font-mono focus:outline-none focus:border-[#881930]"
  />
                    <button
    type="submit"
    disabled={isCheckingPincode}
    className="px-2.5 py-1 text-[11px] font-semibold bg-stone-200 hover:bg-stone-300 rounded text-stone-800 cursor-pointer"
  >
                      {isCheckingPincode ? "..." : "Check"}
                    </button>
                    {pincodeCity && <span className="text-[11px] text-emerald-800 font-medium truncate ml-1">
                        ✓ {pincodeCity}
                      </span>}
                  </form>
                </div>

                {
    /* Quantity and Action Buttons */
  }
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {
    /* Quantity Counter */
  }
                    {product.stock > 0 && <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden shrink-0 bg-white">
                        <button
    type="button"
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    disabled={quantity <= 1}
    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
    aria-label="Decrease quantity"
  >
                          -
                        </button>
                        <span className="px-2 py-2 text-xs font-mono font-semibold min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
    type="button"
    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
    disabled={quantity >= product.stock}
    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
    aria-label="Increase quantity"
  >
                          +
                        </button>
                      </div>}

                    {
    /* Add to Bag Button */
  }
                    <Button
    type="button"
    onClick={handleAddToCart}
    disabled={product.stock <= 0}
    className="flex-1 text-xs sm:text-sm py-2.5"
  >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      <span>{product.stock > 0 ? "Add to Bag" : "Out of Stock"}</span>
                    </Button>

                    {
    /* Buy Now Button */
  }
                    {product.stock > 0 && <button
    type="button"
    onClick={handleBuyNow}
    className="py-2.5 px-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
  >
                        Buy Now
                      </button>}

                    {
    /* Wishlist Button */
  }
                    <button
    type="button"
    onClick={() => addToWishlist(product)}
    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${isLiked ? "border-rose-300 bg-rose-50 text-rose-600" : "border-stone-300 text-stone-700 hover:text-rose-600 hover:border-stone-400 bg-white"}`}
    title={isLiked ? "In Wishlist" : "Add to Wishlist"}
    aria-label="Wishlist"
  >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-rose-600" : ""}`} />
                    </button>
                  </div>

                  {
    /* Virtual Try-On Camera Button */
  }
                  <button
    type="button"
    onClick={() => setIsTryOnOpen(true)}
    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300 hover:border-[#881930] text-stone-900 hover:text-[#881930] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:bg-amber-100/60 transition-all"
  >
                    <Camera className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Virtual Try-On: Live Camera Drape Visualizer</span>
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                  </button>

                  {
    /* Added to Bag Instant Feedback Banner */
  }
                  {addedJustNow && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs animate-fade-in">
                      <div className="flex items-center gap-2 text-emerald-900 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Saree successfully added to your bag!</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
    type="button"
    onClick={() => {
      onClose();
      setIsCartDrawerOpen(true);
    }}
    className="px-3 py-1 bg-emerald-800 text-white rounded-md font-medium hover:bg-emerald-900 transition-colors cursor-pointer text-xs"
  >
                          View Bag
                        </button>
                      </div>
                    </div>}
                </div>
              </div>

              {
    /* Bottom Footer: Trust highlights & Full Page Link */
  }
              <div className="pt-3 border-t border-stone-200 space-y-2.5">
                {
    /* Trust mini-strip */
  }
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-stone-600">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Silk Mark 100% Pure</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Insured Transit</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-[#881930]" />
                    <span>7-Day Easy Exchange</span>
                  </div>
                </div>

                {
    /* View Full Product & Styling Guide Link */
  }
                <button
    type="button"
    onClick={handleViewFullProduct}
    className="w-full py-2 px-3 text-xs font-semibold text-[#881930] hover:text-[#520f1d] hover:bg-stone-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
  >
                  <span>View Full Details, Styling Guide & Patron Reviews</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Virtual Try-On Modal */
  }
      {product && <VirtualTryOnModal
    product={product}
    isOpen={isTryOnOpen}
    onClose={() => setIsTryOnOpen(false)}
  />}

      {
    /* Reusable Size Guide Modal */
  }
      {product && <SizeGuideModal
    isOpen={isSizeGuideOpen}
    onClose={() => setIsSizeGuideOpen(false)}
    sareeLength={product.sareeLength}
    blouseDetails={product.blousePieceIncluded ? "0.8m Unstitched Brocade Blouse Piece Included" : void 0}
  />}
    </div>;
};
