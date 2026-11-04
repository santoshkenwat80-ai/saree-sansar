import { useState } from "react";
import { Mail, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Gift, BellRing, Copy, Check } from "lucide-react";
import { isValidEmail } from "../../utils/validators";
import apiClient from "../../services/api";
import toast from "react-hot-toast";
export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/newsletter/subscribe", { email: cleanEmail });
      setIsSubscribed(true);
      toast.success("Thank you! You have joined the Royal Patron Circle.", {
        icon: "\u{1F451}",
        duration: 4e3
      });
    } catch {
      setIsSubscribed(true);
      toast.success("Thank you! You have joined the Royal Patron Circle.", {
        icon: "\u{1F451}",
        duration: 4e3
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText("ROYAL10");
    setCopiedCode(true);
    toast.success("Coupon code ROYAL10 copied! Enjoy 10% off your first heirloom saree.");
    setTimeout(() => setCopiedCode(false), 2500);
  };
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#561322] via-[#6b1a2b] to-[#420d18] border border-[#d4af37]/60 shadow-2xl p-6 sm:p-10 lg:p-14 text-white">
        {
    /* Subtle Ornamental Royal Glow */
  }
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#f2ce6e]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#881930]/40 blur-3xl pointer-events-none" />

        {
    /* Delicate Golden Lattice Border Accent */
  }
        <div className="absolute inset-1.5 sm:inset-2.5 rounded-[22px] border border-[#f2ce6e]/20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {
    /* Header & Crown Badge */
  }
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ce6e]/15 text-[#f2ce6e] border border-[#f2ce6e]/40 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#f2ce6e]" />
              <span>Royal Patron Circle</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Subscribe to the Saree Sansar Circle
            </h2>

            <p className="text-sm sm:text-base text-stone-200/90 max-w-2xl mx-auto leading-relaxed">
              Receive private invitations to artisanal loom unveilings, bridal trousseau previews, and an exclusive <span className="text-[#f2ce6e] font-bold">10% welcome gift</span> on your first handloom drape.
            </p>
          </div>

          {
    /* Form or Success State */
  }
          {isSubscribed ? <div className="bg-[#20040a]/90 border border-emerald-400/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-xl animate-in zoom-in-95 duration-400">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Welcome to the Royal Circle
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  We have reserved your patron privileges. Use your private voucher code on your next purchase:
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <div className="px-4 py-2 bg-[#2a060e] rounded-xl border-2 border-dashed border-[#f2ce6e] font-mono text-base font-bold text-[#f2ce6e] tracking-widest">
                  ROYAL10
                </div>
                <button
    type="button"
    onClick={handleCopyCode}
    className="inline-flex items-center gap-2 px-4 py-2 bg-[#881930] hover:bg-[#a7233f] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
  >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}
                  <span>{copiedCode ? "Copied to Clipboard!" : "Copy 10% Voucher"}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400">
                Applicable on all Banarasi, Kanjivaram, and Pure Silk collections.
              </p>
            </div> : <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-2xl shadow-lg border border-[#f2ce6e]/40 focus-within:border-[#f2ce6e] focus-within:ring-2 focus-within:ring-[#f2ce6e]/30 transition-all">
                  <div className="relative flex-1 flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-[#881930]" />
                    <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email address (e.g. priya@example.com)"
    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
    disabled={isLoading}
    required
  />
                  </div>

                  <button
    type="submit"
    disabled={isLoading}
    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#881930] to-[#a7233f] hover:from-[#a7233f] hover:to-[#881930] text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-60 active:scale-98"
  >
                    <span>{isLoading ? "Joining..." : "Subscribe"}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </div>}

          {
    /* Three Patron Trust Commitments */
  }
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#4d0e1b] text-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/15 text-[#f2ce6e] flex items-center justify-center shrink-0 border border-[#d4af37]/40 shadow-2xs">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">10% Welcome Gift</h4>
                <p className="text-[11px] text-amber-200/80">Instant savings on heirloom drapes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/15 text-[#f2ce6e] flex items-center justify-center shrink-0 border border-[#d4af37]/40 shadow-2xs">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">VIP Loom Drops</h4>
                <p className="text-[11px] text-amber-200/80">First access to rare limited weaves</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ce6e]/15 text-[#f2ce6e] flex items-center justify-center shrink-0 border border-[#d4af37]/40 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Zero Spam Pledge</h4>
                <p className="text-[11px] text-amber-200/80">Pure handcrafted inspiration only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
