import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Tag,
  CreditCard,
  Gift,
  Truck,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  ShoppingBag,
  Zap,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { formatINR } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
export const SSAssuredBadge = ({
  size = "md",
  className = ""
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const sizeClasses = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] px-2 py-0.5",
    lg: "text-xs px-2.5 py-1"
  };
  return <div className={`relative inline-flex items-center ${className}`}>
      <span
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    onClick={() => setShowTooltip(!showTooltip)}
    className={`inline-flex items-center gap-1 font-extrabold italic bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white rounded shadow-xs cursor-pointer select-none tracking-tight ${sizeClasses[size]}`}
    title="Saree Sansar Assured Quality"
  >
        <span>SS</span>
        <span className="not-italic text-[#f2ce6e] font-black">✓</span>
        <span className="tracking-normal font-bold">Assured</span>
      </span>

      {showTooltip && <div className="absolute bottom-full left-0 mb-2 w-64 bg-stone-900 text-white text-[11px] rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 border border-stone-700">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Saree Sansar Assured Guarantee</span>
          </div>
          <ul className="space-y-1 text-stone-300 text-[10px] leading-tight">
            <li>• 6-Step Artisan &amp; Zari Quality Checked</li>
            <li>• 100% Certified Natural Pure Silk Mark</li>
            <li>• Same-Day Dispatch &amp; Doorstep Delivery</li>
            <li>• 7-Day Hassle-Free Return Guarantee</li>
          </ul>
        </div>}
    </div>;
};
export const FlipkartAvailableOffers = ({ product }) => {
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCoupon(false), 2e3);
  };
  const initialOffers = [
    {
      type: "Bank Offer",
      title: "5% Unlimited Cashback on Flipkart Axis Bank / HDFC Bank Cards",
      desc: "Max discount up to \u20B91,500 on orders above \u20B95,000.",
      icon: CreditCard,
      color: "text-emerald-700"
    },
    {
      type: "Special Price",
      title: "Get extra \u20B92,000 off on Pure Handloom Sarees",
      desc: "Special festive price inclusive of instant master weaver discount.",
      icon: Tag,
      color: "text-amber-700"
    },
    {
      type: "Welcome Offer",
      title: "Flat 10% Off on your first order with coupon FIRST10",
      desc: "Applicable across all Banarasi, Kanjivaram and Tussar silk sarees.",
      icon: Gift,
      color: "text-rose-700",
      action: {
        label: copiedCoupon ? "Copied" : "Copy Code",
        onClick: () => handleCopyCoupon("FIRST10")
      }
    }
  ];
  const extraOffers = [
    {
      type: "Combo Offer",
      title: "Buy 2 Sarees get Extra 5% Off | Buy 3 get Extra 10% Off",
      desc: "Automatic bundle savings applied directly at checkout.",
      icon: ShoppingBag,
      color: "text-blue-700"
    },
    {
      type: "Partner Offer",
      title: "Free Insured Express Delivery across 27,000+ PIN Codes",
      desc: "Complimentary BlueDart Air shipping with 100% transit insurance.",
      icon: Truck,
      color: "text-purple-700"
    },
    {
      type: "UPI Offer",
      title: "Instant \u20B9150 Flat Discount on Pre-paid UPI (GPay/PhonePe)",
      desc: "Valid on direct scan & pay at checkout.",
      icon: Zap,
      color: "text-emerald-700"
    }
  ];
  const visibleOffers = showAllOffers ? [...initialOffers, ...extraOffers] : initialOffers;
  return <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>Available Offers</span>
        </h4>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
          6 Offers Active
        </span>
      </div>

      <div className="space-y-2.5">
        {visibleOffers.map((offer, idx) => {
    const Icon = offer.icon;
    return <div key={idx} className="flex items-start gap-2.5 text-xs">
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${offer.color}`} />
              <div className="flex-1 leading-snug">
                <span className="font-bold text-stone-900">{offer.type}: </span>
                <span className="text-stone-700">{offer.title}</span>
                <span className="text-[11px] text-stone-400 block mt-0.5">{offer.desc}</span>
              </div>
              {offer.action ? <button
      type="button"
      onClick={offer.action.onClick}
      className="shrink-0 px-2.5 py-1 rounded bg-[#881930] hover:bg-[#6b1426] text-white text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
    >
                  {offer.action.label}
                </button> : <button
      type="button"
      onClick={() => toast("Terms & Conditions: Valid on online orders. Cannot be combined with wholesale orders.")}
      className="text-[10px] text-blue-600 hover:underline shrink-0 font-semibold"
    >
                  T&amp;C
                </button>}
            </div>;
  })}
      </div>

      <button
    type="button"
    onClick={() => setShowAllOffers(!showAllOffers)}
    className="text-xs font-bold text-[#881930] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
  >
        <span>{showAllOffers ? "View fewer offers" : `View ${extraOffers.length} more offers`}</span>
        {showAllOffers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>;
};
export const FlipkartDeliveryTimer = ({ initialPincode = "495671" }) => {
  const [pincode, setPincode] = useState(initialPincode);
  const [isEditing, setIsEditing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 30, seconds: 0 };
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const deliveryDate = /* @__PURE__ */ new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setIsEditing(false);
      toast.success(`Delivery address updated to PIN ${pincode}`);
    } else {
      toast.error("Please enter a valid 6-digit PIN code");
    }
  };
  return <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
      {
    /* Pincode Row */
  }
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <Truck className="w-4 h-4 text-[#881930]" />
          <span>Deliver to:</span>
          {!isEditing ? <span className="font-bold text-stone-900 font-mono">
              {pincode || "495671"}
            </span> : <form onSubmit={handlePincodeSubmit} className="flex items-center gap-1.5">
              <input
    type="text"
    maxLength={6}
    value={pincode}
    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
    className="w-24 px-2 py-0.5 border border-stone-300 rounded text-xs font-mono"
    placeholder="6-digit PIN"
    autoFocus
  />
              <button
    type="submit"
    className="px-2 py-0.5 bg-[#881930] text-white rounded text-[11px] font-bold"
  >
                Apply
              </button>
            </form>}
        </div>

        {!isEditing && <button
    type="button"
    onClick={() => setIsEditing(true)}
    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
  >
            Change
          </button>}
      </div>

      {
    /* Exact Delivery Date & Free Delivery Badge */
  }
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-900">
            Delivery by {formattedDelivery}
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            FREE <span className="line-through text-stone-400 font-normal">₹40</span>
          </span>
        </div>

        {
    /* Live Countdown Timer */
  }
        <p className="text-[11px] text-stone-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>
            Order within{" "}
            <strong className="text-stone-900 font-mono">
              {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
            </strong>{" "}
            for same-day priority dispatch
          </span>
        </p>
      </div>

      {
    /* Flipkart Trust Guarantees */
  }
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Cash on Delivery Available</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>7-Day Return / Exchange</span>
        </div>
      </div>
    </div>;
};
export const FrequentlyBoughtTogether = ({ currentProduct }) => {
  const { addToCart } = useCart();
  const [includeBlouse, setIncludeBlouse] = useState(true);
  const [includeJewellery, setIncludeJewellery] = useState(true);
  const blouseItem = {
    name: "Unstitched Pure Zari Heavy Brocade Blouse Piece",
    price: 1999,
    originalPrice: 2999
  };
  const jewelleryItem = {
    name: "Handcrafted Antique Temple Gold Plated Choker Set",
    price: 2499,
    originalPrice: 3999
  };
  let totalPrice = currentProduct.price;
  let totalOriginal = currentProduct.originalPrice || currentProduct.price;
  if (includeBlouse) {
    totalPrice += blouseItem.price;
    totalOriginal += blouseItem.originalPrice;
  }
  if (includeJewellery) {
    totalPrice += jewelleryItem.price;
    totalOriginal += jewelleryItem.originalPrice;
  }
  const bundleDiscount = Math.round(totalPrice * 0.08);
  const finalComboPrice = totalPrice - bundleDiscount;
  const handleAddComboToCart = () => {
    addToCart(currentProduct, 1);
    toast.success("Combo bundle added to your bag with extra combo discount!", { icon: "\u{1F381}" });
  };
  return <div className="mt-12 p-5 sm:p-6 bg-gradient-to-br from-amber-50/60 to-stone-50 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#881930] text-[#f2ce6e] flex items-center justify-center font-bold text-xs">
            +
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
              Frequently Bought Together · Complete the Royal Look
            </h3>
            <p className="text-xs text-stone-500">
              Curated by master stylists for bridal &amp; festive grace
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
          Save Extra {formatINR(bundleDiscount)}
        </span>
      </div>

      {
    /* Items Preview */
  }
      <div className="flex flex-col md:flex-row items-center gap-4">
        {
    /* Item 1: The Saree */
  }
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex-1 w-full">
          <img
    src={currentProduct.images[0]}
    alt={currentProduct.name}
    className="w-14 h-16 object-cover rounded-lg border border-stone-200"
  />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
              This Saree
            </span>
            <p className="text-xs font-semibold text-stone-900 truncate mt-0.5">
              {currentProduct.name}
            </p>
            <p className="text-xs font-bold text-[#881930] font-mono mt-0.5">
              {formatINR(currentProduct.price)}
            </p>
          </div>
          <span className="text-emerald-600 font-bold text-xs">✓ Added</span>
        </div>

        <Plus className="w-5 h-5 text-stone-400 shrink-0" />

        {
    /* Item 2: Matching Blouse Piece */
  }
        <label className={`flex items-center gap-3 bg-white p-3 rounded-xl border transition-all cursor-pointer flex-1 w-full ${includeBlouse ? "border-[#881930] ring-1 ring-[#881930]/30 shadow-2xs" : "border-stone-200 opacity-60"}`}>
          <input
    type="checkbox"
    checked={includeBlouse}
    onChange={(e) => setIncludeBlouse(e.target.checked)}
    className="w-4 h-4 text-[#881930] rounded focus:ring-[#881930]"
  />
          <div className="w-14 h-16 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-center p-1 text-[10px] text-rose-900 font-bold leading-tight shrink-0">
            Brocade Blouse
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate">
              {blouseItem.name}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-stone-900 font-mono">
                {formatINR(blouseItem.price)}
              </span>
              <span className="text-[10px] text-stone-400 line-through font-mono">
                {formatINR(blouseItem.originalPrice)}
              </span>
            </div>
          </div>
        </label>

        <Plus className="w-5 h-5 text-stone-400 shrink-0" />

        {
    /* Item 3: Temple Jewellery */
  }
        <label className={`flex items-center gap-3 bg-white p-3 rounded-xl border transition-all cursor-pointer flex-1 w-full ${includeJewellery ? "border-[#881930] ring-1 ring-[#881930]/30 shadow-2xs" : "border-stone-200 opacity-60"}`}>
          <input
    type="checkbox"
    checked={includeJewellery}
    onChange={(e) => setIncludeJewellery(e.target.checked)}
    className="w-4 h-4 text-[#881930] rounded focus:ring-[#881930]"
  />
          <div className="w-14 h-16 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-center p-1 text-[10px] text-amber-900 font-bold leading-tight shrink-0">
            Temple Jewellery
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate">
              {jewelleryItem.name}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-stone-900 font-mono">
                {formatINR(jewelleryItem.price)}
              </span>
              <span className="text-[10px] text-stone-400 line-through font-mono">
                {formatINR(jewelleryItem.originalPrice)}
              </span>
            </div>
          </div>
        </label>
      </div>

      {
    /* Bundle Action Strip */
  }
      <div className="pt-3 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-stone-600 font-medium">Combo Total:</span>
          <span className="text-xl font-bold font-mono text-[#881930]">
            {formatINR(finalComboPrice)}
          </span>
          <span className="text-xs text-stone-400 line-through font-mono">
            {formatINR(totalOriginal)}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Save {formatINR(totalOriginal - finalComboPrice)}
          </span>
        </div>

        <button
    type="button"
    onClick={handleAddComboToCart}
    className="w-full sm:w-auto px-6 py-2.5 bg-[#881930] hover:bg-[#6b1426] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
  >
          <ShoppingBag className="w-4 h-4 text-[#f2ce6e]" />
          <span>Add Combo to Bag</span>
        </button>
      </div>
    </div>;
};
export const FlipkartProductQA = ({ product }) => {
  const [searchQA, setSearchQA] = useState("");
  const [askOpen, setAskOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const defaultQAs = [
    {
      q: "Is the blouse piece included with this saree?",
      a: "Yes, 0.8 meter matching unstitched blouse piece in woven brocade zari fabric is attached with the saree.",
      author: "Master Weaver Desk",
      date: "Verified Answer"
    },
    {
      q: "Is the zari real gold or tested gold zari?",
      a: "This handloom saree features certified tested antique gold zari woven with Silk Mark certified natural silk threads.",
      author: "Silk Mark Authenticator",
      date: "Verified Answer"
    },
    {
      q: "Can this saree be washed at home?",
      a: "Strictly Dry Clean Only. Please store wrapped in clean muslin or cotton cloth to protect the tested zari motifs.",
      author: "Saree Sansar Care Desk",
      date: "Verified Answer"
    },
    {
      q: "What is the exact weight and length of this saree?",
      a: `Total saree length is 5.5 meters + 0.8 meter blouse piece (total 6.3m). The weight is approximately 850\u2013920 grams of rich, pure handloom silk.`,
      author: "Craft Guild",
      date: "Verified Answer"
    }
  ];
  const filteredQAs = searchQA.trim() ? defaultQAs.filter(
    (qa) => qa.q.toLowerCase().includes(searchQA.toLowerCase()) || qa.a.toLowerCase().includes(searchQA.toLowerCase())
  ) : defaultQAs;
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    toast.success("Your question has been sent to our master weaving guild! We usually respond within 2 hours.", { icon: "\u{1F4AC}" });
    setQuestionText("");
    setAskOpen(false);
  };
  return <div className="mt-14 pt-10 border-t border-stone-200 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#a07817] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#a07817]" />
            Questions &amp; Answers
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            Have Questions About This Saree?
          </h2>
        </div>

        <button
    type="button"
    onClick={() => setAskOpen(!askOpen)}
    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
  >
          {askOpen ? "Cancel" : "Ask a Question"}
        </button>
      </div>

      {askOpen && <form onSubmit={handleAskQuestion} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 animate-in fade-in">
          <label className="block text-xs font-semibold text-stone-700">
            Ask our weaving experts or certified patrons:
          </label>
          <textarea
    rows={2}
    value={questionText}
    onChange={(e) => setQuestionText(e.target.value)}
    placeholder="e.g. Is the pallu double-sided? How bright is the crimson red shade in natural sunlight?"
    className="w-full p-3 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930]"
    required
  />
          <button
    type="submit"
    className="px-4 py-2 bg-[#881930] text-white text-xs font-bold rounded-lg hover:bg-[#6b1426] transition-colors cursor-pointer"
  >
            Submit Question
          </button>
        </form>}

      {
    /* Search Q&A */
  }
      <div className="relative">
        <input
    type="text"
    value={searchQA}
    onChange={(e) => setSearchQA(e.target.value)}
    placeholder="Search questions about fabric, blouse piece, zari, care..."
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930]"
  />
      </div>

      {
    /* Q&A List */
  }
      <div className="divide-y divide-stone-100">
        {filteredQAs.map((item, idx) => <div key={idx} className="py-3.5 space-y-1.5">
            <p className="text-xs font-bold text-stone-900 flex items-start gap-2">
              <span className="font-mono text-[#881930]">Q:</span>
              <span>{item.q}</span>
            </p>
            <p className="text-xs text-stone-700 leading-relaxed pl-5 flex items-start gap-2">
              <span className="font-mono text-emerald-700 font-bold">A:</span>
              <span>{item.a}</span>
            </p>
            <div className="pl-5 text-[10px] text-stone-400 flex items-center gap-2 pt-0.5">
              <span className="font-semibold text-stone-600">{item.author}</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> {item.date}
              </span>
            </div>
          </div>)}
      </div>
    </div>;
};
export const FlipkartMobileStickyBuyBar = ({ product, quantity = 1 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`"${product.name}" added to bag!`, { icon: "\u{1F6CD}\uFE0F" });
  };
  return <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200/90 shadow-2xl px-3 py-2 flex items-center gap-2">
      {
    /* Price Info */
  }
      <div className="shrink-0 leading-tight pr-2 border-r border-stone-200">
        <span className="text-sm font-bold font-mono text-stone-900 block">
          {formatINR(product.price)}
        </span>
        {product.discountPercent > 0 && <span className="text-[10px] font-bold text-emerald-700 block">
            {product.discountPercent}% off
          </span>}
      </div>

      {
    /* Add To Bag (Yellow / White Accent) */
  }
      <button
    type="button"
    onClick={handleAddToCart}
    disabled={product.stock <= 0}
    className="flex-1 py-2.5 px-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
  >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Add to Bag</span>
      </button>

      {
    /* Buy Now (Iconic Orange / Crimson Flipkart Button) */
  }
      <button
    type="button"
    onClick={handleBuyNow}
    disabled={product.stock <= 0}
    className="flex-1 py-2.5 px-2 bg-[#881930] hover:bg-[#6b1426] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
  >
        <Zap className="w-3.5 h-3.5 text-[#f2ce6e]" />
        <span>Buy Now</span>
      </button>
    </div>;
};
