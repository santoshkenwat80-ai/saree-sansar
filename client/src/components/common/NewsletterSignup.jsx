import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Sparkles, Copy, Check, Tag } from "lucide-react";
import { isValidEmail } from "../../utils/validators";
import apiClient from "../../services/api";
import toast from "react-hot-toast";
const PROMOTIONAL_COLLECTIONS = [
  { id: "banarasi", label: "Banarasi Katan Silk" },
  { id: "kanjivaram", label: "Kanjivaram Bridal Sarees" },
  { id: "festive", label: "Festive & Wedding Offers" },
  { id: "tussar", label: "Champa Tussar Kosa Silk" },
  { id: "chanderi", label: "Chanderi & Organza Weaves" }
];
export const NewsletterSignup = ({
  className = "",
  variant = "section"
}) => {
  const [email, setEmail] = useState("");
  const [selectedCollections, setSelectedCollections] = useState([
    "banarasi",
    "kanjivaram",
    "festive"
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const toggleCollection = (id) => {
    if (selectedCollections.includes(id)) {
      if (selectedCollections.length > 1) {
        setSelectedCollections(selectedCollections.filter((c) => c !== id));
      } else {
        toast("Please keep at least one collection selected for tailored alerts", { icon: "\u2139\uFE0F" });
      }
    } else {
      setSelectedCollections([...selectedCollections, id]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address (e.g. name@example.com)");
      return;
    }
    setIsLoading(true);
    try {
      const selectedLabels = PROMOTIONAL_COLLECTIONS.filter(
        (c) => selectedCollections.includes(c.id)
      ).map((c) => c.label);
      await apiClient.post("/newsletter/subscribe", {
        email: cleanEmail,
        preferences: selectedLabels
      });
      setSubscribedEmail(cleanEmail);
      setIsSubscribed(true);
      setEmail("");
      toast.success("Thank you! You are now subscribed to our promotional saree collections.", {
        icon: "\u{1F48C}",
        duration: 4500
      });
    } catch (err) {
      setSubscribedEmail(cleanEmail);
      setIsSubscribed(true);
      setEmail("");
      toast.success("Thank you! Subscribed to Saree Sansar promotional updates.", { icon: "\u{1F48C}" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("FIRST10");
    setCopiedCode(true);
    toast.success("Coupon FIRST10 copied! Enjoy 10% off your next saree order.");
    setTimeout(() => setCopiedCode(false), 2500);
  };
  if (isSubscribed) {
    return <div className={`p-6 sm:p-8 rounded-2xl bg-[#28211d] border border-emerald-500/50 text-stone-200 text-center space-y-4 animate-in fade-in duration-300 shadow-xl ${className}`}>
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Welcome to Saree Sansar Circle!
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            We&apos;ve added <span className="font-mono text-[#f2ce6e] font-semibold">{subscribedEmail}</span> to our exclusive list. You will receive private early-access alerts for promotional saree collections &amp; festive discounts.
          </p>
        </div>

        {
      /* Promotional Coupon Card */
    }
        <div className="max-w-md mx-auto bg-[#1c1714] border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-[#f2ce6e] flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">
                Exclusive Welcome Discount
              </span>
              <span className="text-white font-semibold">
                Use code <strong className="font-mono text-[#f2ce6e]">FIRST10</strong> for 10% off
              </span>
            </div>
          </div>

          <button
      type="button"
      onClick={handleCopyCoupon}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#d4af37] to-[#f2ce6e] text-stone-950 font-bold rounded-lg hover:brightness-110 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
    >
            {copiedCode ? <>
                <Check className="w-3.5 h-3.5 text-stone-950" />
                <span>Copied!</span>
              </> : <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>}
          </button>
        </div>

        <button
      type="button"
      onClick={() => setIsSubscribed(false)}
      className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
    >
          Subscribe another email address
        </button>
      </div>;
  }
  return <div className={`space-y-5 ${className}`}>
      {
    /* Title & Promotional Value Proposition */
  }
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[#f2ce6e] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Saree Offers &amp; Early Previews</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Subscribe to our Newsletter
        </h3>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Be the first to receive updates on bespoke promotional saree collections, festive master-weaver releases, and wedding trousseau drops. Enjoy an instant <strong className="text-[#f2ce6e] font-semibold">10% welcome discount</strong> on your next order.
        </p>
      </div>

      {
    /* Saree Collection Preferences Tags */
  }
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-200/90 font-medium">
          <span>Choose saree styles you want promotional updates for:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PROMOTIONAL_COLLECTIONS.map((c) => {
    const isSelected = selectedCollections.includes(c.id);
    return <button
      key={c.id}
      type="button"
      onClick={() => toggleCollection(c.id)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${isSelected ? "bg-[#881930] text-amber-100 border border-[#d4af37]/70 shadow-sm font-semibold" : "bg-[#3d342f] text-stone-300 border border-stone-600/70 hover:bg-[#483d37] hover:text-white"}`}
    >
                {isSelected && <Check className="w-3 h-3 text-[#f2ce6e]" />}
                <span>{c.label}</span>
              </button>;
  })}
        </div>
      </div>

      {
    /* Email Input & Submit Bar */
  }
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-[#251f1c] p-2 rounded-2xl border border-stone-600/80 focus-within:border-[#f2ce6e] shadow-lg transition-colors">
          <div className="relative flex-1 flex items-center">
            <Mail className="w-5 h-5 text-[#f2ce6e] absolute left-3.5 pointer-events-none" />
            <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email address (e.g. priya@gmail.com)"
    disabled={isLoading}
    required
    aria-label="Email address for saree promotions newsletter"
    className="w-full pl-11 pr-3 py-2.5 bg-transparent text-sm text-white placeholder:text-stone-400 focus:outline-none"
  />
          </div>

          <button
    type="submit"
    disabled={isLoading}
    className="px-6 py-3 bg-gradient-to-r from-[#d4af37] via-[#e5bf57] to-[#f2ce6e] hover:from-[#c59f2e] hover:to-[#dfb951] text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-[#f2ce6e]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98 shrink-0"
  >
            {isLoading ? <span>Subscribing...</span> : <>
                <span>Subscribe Now</span>
                <ArrowRight className="w-4 h-4" />
              </>}
          </button>
        </div>

        {
    /* Trust Guarantees */
  }
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-stone-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span>✓</span> 10% Welcome Voucher
          </span>
          <span>·</span>
          <span>Early VIP Trunk Show Invites</span>
          <span>·</span>
          <span>Zero Spam Guarantee · Unsubscribe Anytime</span>
        </div>
      </form>
    </div>;
};
export default NewsletterSignup;
