import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Ruler,
  Award,
  MessageCircle
} from "lucide-react";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatINR, calculateDiscount } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { SizeGuideModal } from "../../components/common/SizeGuideModal";
import { RecommendedProductsWidget } from "../../components/products/RecommendedProductsWidget";
import { SareeReviews } from "../../components/products/SareeReviews";
import { SareeImageMagnifier } from "../../components/products/SareeImageMagnifier";
import { recordProductView } from "../../utils/recentViews";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import toast from "react-hot-toast";
export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getProductByIdOrSlug(slug).then((prod) => {
      if (prod) {
        const imgs = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : prod.image ? [prod.image] : [heroBridalImg];
        const normalizedProd = {
          ...prod,
          images: imgs
        };
        setProduct(normalizedProd);
        setSelectedImage(imgs[0] || "");
        recordProductView(normalizedProd);
      } else {
        setProduct(null);
      }
    }).catch((err) => {
      console.error("Failed to load product:", err);
      setProduct(null);
    }).finally(() => setLoading(false));
  }, [slug]);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };
  if (loading) return <Loader message="Loading saree details..." />;
  if (!product) {
    return <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Saree Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">The requested saree might be unavailable or unlisted.</p>
        <Link to="/products" className="inline-block mt-4 px-6 py-2 bg-[#881930] text-white rounded-lg text-sm font-semibold hover:bg-[#6b1426]">
          View All Sarees
        </Link>
      </div>;
  }
  const isLiked = isInWishlist(product.id);
  const discountVal = calculateDiscount(product.originalPrice, product.price);
  const imagesList = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [heroBridalImg];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {
    /* Simple Clean Breadcrumb */
  }
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link to="/products" className="hover:text-stone-900">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-[#881930] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {
    /* Main Product Details Layout */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {
    /* Left: Image Gallery */
  }
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {
    /* Thumbnails */
  }
          {imagesList.length > 1 && <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {imagesList.map((img, idx) => <button
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`w-16 h-20 sm:w-18 sm:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${(selectedImage || imagesList[0]) === img ? "border-[#881930] ring-1 ring-[#881930]" : "border-stone-200 opacity-70 hover:opacity-100 hover:border-amber-300"}`}
  >
                  <img
    src={img}
    alt={`${product.name} ${idx + 1}`}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                </button>)}
            </div>}

          {
    /* Main Selected Image */
  }
          <div className="flex-1">
            <SareeImageMagnifier
    src={selectedImage || imagesList[0] || ""}
    alt={product.name}
    fabricName={product.fabric}
    onShare={handleShare}
    silkMark={true}
  />
          </div>
        </div>

        {
    /* Right: Clean Product Info & Purchase Form */
  }
        <div className="lg:col-span-5 space-y-5">
          {
    /* Title & Category */
  }
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a07817] uppercase tracking-wider mb-1">
              <span>{product.fabric}</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            {
    /* Rating & Review Summary */
  }
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-700 text-white text-xs font-bold">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white text-white" />
              </span>
              <span className="text-xs text-stone-600 font-medium">
                {product.reviewsCount} Customer Reviews
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded ml-1">
                ✓ Silk Mark Certified
              </span>
            </div>
          </div>

          {
    /* Price Box */
  }
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#6b1426] font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>}
              {discountVal > 0 && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {discountVal}% OFF
                </span>}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Inclusive of GST. Free express delivery across India.
            </p>
          </div>

          {
    /* Simple Description */
  }
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {
    /* Saree Length & Blouse Details */
  }
          <div className="flex items-center justify-between p-3 bg-[#fdfaf5] rounded-xl border border-[#ebd9c3] text-xs">
            <div>
              <span className="font-semibold text-stone-900 block">Saree Dimensions &amp; Blouse</span>
              <span className="text-stone-600 text-[11px]">
                {product.blousePieceIncluded ? "5.5m Saree + 0.8m Unstitched Blouse Piece" : "5.5m Pure Silk Drape"}
              </span>
            </div>
            <button
    type="button"
    onClick={() => setIsSizeGuideOpen(true)}
    className="text-[#881930] hover:underline font-bold text-xs flex items-center gap-1 shrink-0"
  >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>

          {
    /* Availability & Quantity Selector */
  }
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700">Stock:</span>
              {product.stock > 0 ? <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock</span>
                </span> : <span className="text-xs font-medium text-rose-600">Out of Stock</span>}
            </div>

            {product.stock > 0 && <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">Qty:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                  <button
    type="button"
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    disabled={quantity <= 1}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40 rounded-l-lg font-bold"
  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
    type="button"
    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
    disabled={quantity >= product.stock}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40 rounded-r-lg font-bold"
  >
                    +
                  </button>
                </div>
              </div>}
          </div>

          {
    /* Action Buttons: Add to Bag & Buy Now */
  }
          <div className="space-y-2.5 pt-2">
            <div className="flex gap-3">
              <Button
    onClick={() => addToCart(product, quantity)}
    size="lg"
    variant="outline"
    className="flex-1 border-[#6b1426] text-[#6b1426] hover:bg-rose-50 font-bold"
    disabled={product.stock <= 0}
  >
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>{product.stock > 0 ? "Add to Bag" : "Out of Stock"}</span>
              </Button>

              <Button
    onClick={() => {
      addToCart(product, quantity);
      navigate("/checkout");
    }}
    size="lg"
    className="flex-1 bg-[#6b1426] hover:bg-[#520f1d] text-white font-bold shadow-md"
    disabled={product.stock <= 0}
  >
                <Sparkles className="w-4 h-4 mr-1 text-[#f2ce6e]" />
                <span>Buy Now</span>
              </Button>

              <Button
    onClick={() => addToWishlist(product)}
    variant="outline"
    size="lg"
    className={isLiked ? "text-rose-600 border-rose-300" : ""}
    title={isLiked ? "In Wishlist" : "Add to Wishlist"}
  >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current text-rose-600" : ""}`} />
              </Button>
            </div>

            {
    /* Simple WhatsApp Inquiry Button */
  }
            <a
    href={`https://wa.me/919425505875?text=${encodeURIComponent(
      `Hello! I am interested in: ${product.name} (Price: \u20B9${product.price})`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
  >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask Questions or Request Photos on WhatsApp</span>
            </a>
          </div>

          {
    /* Simple Clean Guarantees Strip */
  }
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-200 text-center text-[11px] text-stone-600">
            <div className="p-2 bg-stone-50 rounded-lg">
              <Award className="w-4 h-4 text-[#a07817] mx-auto mb-1" />
              <span>Pure Silk Certified</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <Truck className="w-4 h-4 text-[#a07817] mx-auto mb-1" />
              <span>Free Express Delivery</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <RotateCcw className="w-4 h-4 text-[#a07817] mx-auto mb-1" />
              <span>7-Day Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Simple Clean Specifications Table */
  }
      <div className="mt-12 pt-8 border-t border-stone-200">
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">
          Saree Specifications &amp; Care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-stone-100">
                <tr className="bg-stone-50/50">
                  <td className="px-4 py-2.5 font-semibold text-stone-600 w-1/3">Fabric</td>
                  <td className="px-4 py-2.5 text-stone-900">{product.fabric}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-stone-600">Color</td>
                  <td className="px-4 py-2.5 text-stone-900">{product.color}</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="px-4 py-2.5 font-semibold text-stone-600">Occasion</td>
                  <td className="px-4 py-2.5 text-stone-900">{product.occasion}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-stone-600">Saree Length</td>
                  <td className="px-4 py-2.5 text-stone-900">{product.sareeLength}</td>
                </tr>
                {Object.entries(product.specifications || {}).map(([key, val]) => <tr key={key} className="even:bg-stone-50/50">
                    <td className="px-4 py-2.5 font-semibold text-stone-600">{key}</td>
                    <td className="px-4 py-2.5 text-stone-900">{val}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          <div className="bg-[#fcf9f2] p-5 rounded-xl border border-[#ebd9c3] space-y-2 text-xs">
            <h3 className="font-serif font-bold text-sm text-[#4a0e1b]">
              Care &amp; Storage Instructions
            </h3>
            <p className="text-stone-700 leading-relaxed">
              {product.careInstructions || "Dry clean only. Store in pure cotton or muslin covers away from direct moisture."}
            </p>
            <div className="text-[11px] text-stone-600 space-y-1 pt-2 border-t border-[#dfb746]/40">
              <p>• Fold along different creases every 3-4 months.</p>
              <p>• Keep in breathable muslin bags to preserve zari lustre.</p>
            </div>
          </div>
        </div>
      </div>

      {
    /* Customer Reviews Section */
  }
      <div className="mt-12">
        <SareeReviews sareeId={product.id} sareeName={product.name} />
      </div>

      {
    /* Recommended Sarees Widget */
  }
      {product && <RecommendedProductsWidget currentProduct={product} />}

      {
    /* Size Guide Modal */
  }
      {product && <SizeGuideModal
    isOpen={isSizeGuideOpen}
    onClose={() => setIsSizeGuideOpen(false)}
    sareeLength={product.sareeLength}
    blouseDetails={product.blousePieceIncluded ? "0.8m Unstitched Blouse Piece Included" : void 0}
  />}
    </div>;
};
export default ProductDetails;
