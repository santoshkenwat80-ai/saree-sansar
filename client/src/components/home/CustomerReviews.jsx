import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  Quote,
  Pause,
  Play,
  Plus,
  X,
  Send
} from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import toast from "react-hot-toast";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import kanjivaramImg from "../../assets/images/saree_kanjivaram_gold_1791698990300.jpg";
import banarasiBlueImg from "../../assets/images/saree_banarasi_blue_1791699014715.jpg";
import chanderiImg from "../../assets/images/saree_chanderi_pastel_1791699001746.jpg";
import heroPalaceImg from "../../assets/images/hero_saree_royal_palace_1792385155671.jpg";
const INITIAL_TESTIMONIALS = [
  {
    id: "rev-1",
    name: "Dr. Meenakshi Iyer",
    city: "New Delhi",
    state: "Delhi",
    rating: 5,
    title: "The Crimson Bridal Banarasi took everyone\u2019s breath away!",
    review: "Finding an authentic handloom Katan silk with genuine antique zari online felt risky, but Saree Sansar exceeded every expectation. The saree arrived in Delhi packed like royalty with the Silk Mark tag. The fall, the drape, and the intricate kadwa jaal were ethereal on my wedding day.",
    sareePurchased: "Royal Crimson Kadwa Bridal Banarasi Saree",
    category: "bridal",
    occasion: "Wedding Day Drape",
    date: "October 2026",
    helpfulCount: 164,
    sareeImage: heroBridalImg,
    avatarBg: "bg-[#6b1426] text-amber-200"
  },
  {
    id: "rev-2",
    name: "Kavitha Ramachandran",
    city: "Bengaluru",
    state: "Karnataka",
    rating: 5,
    title: "Authentic Korvai border that honors South Indian temple craft",
    review: "Being from a family of silk connoisseurs in Chennai, I know real Kanjivaram when I touch the selvedge. The contrast pallu interlocking in the mustard gold drape is 100% authentic handloom. The complimentary blouse piece was generous in length for custom zardosi embroidery.",
    sareePurchased: "Temple Arch Pure Kanjivaram Brocade Saree",
    category: "kanjivaram",
    occasion: "Sister\u2019s Engagement",
    date: "October 2026",
    helpfulCount: 98,
    sareeImage: kanjivaramImg,
    avatarBg: "bg-[#a07817] text-white"
  },
  {
    id: "rev-3",
    name: "Sunita Sharma & Tanya",
    city: "Jaipur",
    state: "Rajasthan",
    rating: 5,
    title: "Unboxing felt like opening a royal heirloom chest from Varanasi",
    review: "The zari fragrance, muslin bag packaging, and personal handwritten artisan blessing note made this the most memorable shopping experience. We draped this for Diwali puja, and family elders could not stop admiring the peacock motifs.",
    sareePurchased: "Meenakari Midnight Blue Banarasi Silk Saree",
    category: "banarasi",
    occasion: "Diwali Festive Puja",
    date: "October 2026",
    helpfulCount: 122,
    sareeImage: banarasiBlueImg,
    avatarBg: "bg-[#1b3b6f] text-cyan-200"
  },
  {
    id: "rev-4",
    name: "Ananya Sengupta",
    city: "Kolkata",
    state: "West Bengal",
    rating: 5,
    title: "Featherlight pure Chanderi with the softest drape imaginable",
    review: "Often heavy silk gets unbearable during Kolkata celebrations, but this pastel handloom Chanderi felt like a second skin. The ashrafi buttis caught the festive lights subtly without being loud. Will cherish this drape forever.",
    sareePurchased: "Gulab Jal Pastel Chanderi Zari Border Saree",
    category: "festive",
    occasion: "Durga Puja Ashtami",
    date: "September 2026",
    helpfulCount: 85,
    sareeImage: chanderiImg,
    avatarBg: "bg-[#4a1236] text-rose-200"
  },
  {
    id: "rev-5",
    name: "Priyanka & Rajesh Verma",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 5,
    title: "Delivered in 48 hours before reception. Customer care was extraordinary!",
    review: "We had a courier delay with another boutique and reached out to Saree Sansar in panic. Their team expedited shipping to Mumbai within 2 days with real-time WhatsApp updates. The red Banarasi bridal saree stole the entire evening.",
    sareePurchased: "Shikargah Heritage Katan Banarasi Silk",
    category: "bridal",
    occasion: "Wedding Reception",
    date: "September 2026",
    helpfulCount: 141,
    sareeImage: heroPalaceImg,
    avatarBg: "bg-[#881930] text-[#f2ce6e]"
  },
  {
    id: "rev-6",
    name: "Radhika Deshmukh",
    city: "Pune",
    state: "Maharashtra",
    rating: 5,
    title: "Genuine Silk Mark certified. Laboratory pure test passed!",
    review: "I got the silk burn-tested and verified with the Silk Mark board authority QR code. It is 100% pure mulberry silk. In an era of polyester powerloom counterfeits, Saree Sansar is the real guardian of Varanasi weavers.",
    sareePurchased: "Antique Gold Zari Kanjivaram Bridal Masterpiece",
    category: "kanjivaram",
    occasion: "Housewarming & Vastu",
    date: "August 2026",
    helpfulCount: 109,
    sareeImage: kanjivaramImg,
    avatarBg: "bg-[#1b4332] text-emerald-200"
  }
];
export const CustomerReviews = () => {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formReview, setFormReview] = useState("");
  const [formSaree, setFormSaree] = useState("Royal Banarasi Katan Silk");
  const [formCategory, setFormCategory] = useState("banarasi");
  const [formOccasion, setFormOccasion] = useState("Wedding Celebration");
  const filteredList = testimonials.filter((t) => {
    if (activeCategory === "all") return true;
    return t.category === activeCategory;
  });
  const [cardsPerView, setCardsPerView] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const maxIndex = Math.max(0, filteredList.length - cardsPerView);
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
  }, [maxIndex]);
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
  }, [maxIndex]);
  useEffect(() => {
    if (!isPlaying || maxIndex <= 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, maxIndex, handleNext]);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPlaying(false);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };
  const handleHelpfulClick = (id, e) => {
    e.stopPropagation();
    if (likedReviews[id]) {
      toast("You have already marked this review as helpful", { icon: "\u{1F44D}" });
      return;
    }
    setTestimonials(
      (prev) => prev.map((t) => t.id === id ? { ...t, helpfulCount: t.helpfulCount + 1 } : t)
    );
    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    toast.success("Thank you! Your feedback has been recorded.");
  };
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCity.trim() || !formTitle.trim() || !formReview.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      city: formCity.trim(),
      state: "India",
      rating: formRating,
      title: formTitle.trim(),
      review: formReview.trim(),
      sareePurchased: formSaree,
      category: formCategory,
      occasion: formOccasion,
      date: "Just now",
      helpfulCount: 1,
      sareeImage: heroBridalImg,
      avatarBg: "bg-[#6b1426] text-[#f2ce6e]"
    };
    setTestimonials([newRev, ...testimonials]);
    setActiveCategory("all");
    setCurrentIndex(0);
    setIsWriteReviewOpen(false);
    setFormName("");
    setFormCity("");
    setFormTitle("");
    setFormReview("");
    toast.success("Your review has been submitted successfully! Thank you.", {
      icon: "\u2728",
      duration: 4e3
    });
  };
  return <section
    className="relative py-16 sm:py-24 bg-gradient-to-b from-[#fcfbf9] via-amber-50/20 to-[#f9f7f2] border-y border-stone-200/80 overflow-hidden"
    onKeyDown={handleKeyDown}
    tabIndex={0}
    aria-label="Customer Reviews and Testimonials Carousel"
  >
      {
    /* Subtle Royal Damask / Ornamental Backing Accents */
  }
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a07817]/40 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#a07817]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#881930]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {
    /* 1. Header & Trust Metrics Strip */
  }
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a07817]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patron Voices &amp; Verified Reviews</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Loved by 12,000+ Discerning Brides &amp; Saree Patrons
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every heirloom drape from Saree Sansar weaves a lifetime of memories. Discover how our pure silks illuminated weddings, sacred pujas, and family milestones across India.
            </p>
          </div>

          {
    /* Social Proof Quick Scorecard */
  }
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-white/90 p-3 sm:p-4 rounded-2xl border border-amber-200/60 shadow-sm backdrop-blur-xs">
            <div className="flex items-center gap-2 border-r border-stone-200 pr-3 sm:pr-4">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#881930] leading-none">
                4.9
              </div>
              <div className="space-y-0.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">1,420+ Reviews</div>
              </div>
            </div>

            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Silk Mark Certified</span>
              </div>
              <div className="text-[11px] text-stone-500">Pure Handloom Guaranteed</div>
            </div>

            <button
    onClick={() => setIsWriteReviewOpen(true)}
    className="py-2 px-3.5 bg-[#881930] hover:bg-[#6b1426] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {
    /* 2. Occasion & Category Filter Tabs + Carousel Controls */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          {
    /* Category Tabs */
  }
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
    { id: "all", label: "All Reviews" },
    { id: "bridal", label: "Bridal & Wedding" },
    { id: "banarasi", label: "Banarasi Heritage" },
    { id: "kanjivaram", label: "Kanjivaram Silk" },
    { id: "festive", label: "Festive & Puja" }
  ].map((tab) => {
    const isSelected = activeCategory === tab.id;
    return <button
      key={tab.id}
      onClick={() => setActiveCategory(tab.id)}
      className={`py-1.5 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white shadow-xs font-semibold" : "bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80"}`}
    >
                  {tab.label}
                </button>;
  })}
          </div>

          {
    /* Carousel Arrows & Play/Pause */
  }
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
    onClick={() => setIsPlaying(!isPlaying)}
    className="p-2 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors shadow-2xs cursor-pointer text-xs flex items-center gap-1"
    title={isPlaying ? "Pause Auto-slide" : "Play Auto-slide"}
    aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
  >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            <button
    onClick={handlePrev}
    disabled={filteredList.length <= cardsPerView}
    className="p-2 text-stone-700 hover:text-[#881930] bg-white hover:bg-amber-50 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-stone-200 shadow-2xs transition-colors cursor-pointer"
    aria-label="Previous Testimonial"
  >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-stone-500 px-1">
              {currentIndex + 1} / {Math.max(1, filteredList.length - cardsPerView + 1)}
            </span>

            <button
    onClick={handleNext}
    disabled={filteredList.length <= cardsPerView}
    className="p-2 text-stone-700 hover:text-[#881930] bg-white hover:bg-amber-50 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-stone-200 shadow-2xs transition-colors cursor-pointer"
    aria-label="Next Testimonial"
  >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {
    /* 3. CAROUSEL TRACK */
  }
        <div
    className="relative overflow-hidden cursor-grab active:cursor-grabbing"
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    onMouseEnter={() => setIsPlaying(false)}
    onMouseLeave={() => setIsPlaying(true)}
  >
          <div
    className="flex transition-transform duration-500 ease-out gap-6"
    style={{
      transform: `translateX(-${currentIndex * (100 / cardsPerView + 2)}%)`
    }}
  >
            {filteredList.map((item) => <div
    key={item.id}
    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 flex flex-col justify-between bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 relative group"
  >
                {
    /* Decorative Quote Mark in Gold */
  }
                <div className="absolute top-5 right-5 text-amber-100 pointer-events-none">
                  <Quote className="w-10 h-10 stroke-1 fill-amber-50/80 rotate-180" />
                </div>

                <div className="space-y-3 relative z-10">
                  {
    /* Rating & Verified Badge */
  }
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => <Star
    key={i}
    className={`w-4 h-4 ${i < item.rating ? "fill-current" : "text-stone-300"}`}
  />)}
                      <span className="text-xs font-bold text-stone-800 ml-1 font-mono">
                        {item.rating}.0
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Buyer
                    </span>
                  </div>

                  {
    /* Review Title */
  }
                  <h3 className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-2 pt-1">
                    &ldquo;{item.title}&rdquo;
                  </h3>

                  {
    /* Review Body */
  }
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-4">
                    {item.review}
                  </p>
                </div>

                {
    /* Saree Snapshot & Customer Bio */
  }
                <div className="pt-4 mt-4 border-t border-stone-100 space-y-3 relative z-10">
                  {
    /* Saree Purchased Highlight */
  }
                  <div className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                    <img
    src={item.sareeImage}
    alt={item.sareePurchased}
    className="w-10 h-12 object-cover object-top rounded-lg shrink-0 border border-stone-200"
  />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                        Purchased Saree
                      </span>
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {item.sareePurchased}
                      </p>
                      <span className="text-[10px] text-[#a07817] font-medium">
                        Occasion: {item.occasion}
                      </span>
                    </div>
                  </div>

                  {
    /* Customer Profile & Helpful Button */
  }
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${item.avatarBg}`}
  >
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-stone-500">
                          {item.city}, {item.state} · <span className="font-mono text-[10px]">{item.date}</span>
                        </span>
                      </div>
                    </div>

                    {
    /* Helpful Vote Button */
  }
                    <button
    type="button"
    onClick={(e) => handleHelpfulClick(item.id, e)}
    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1 transition-colors cursor-pointer ${likedReviews[item.id] ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold" : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white hover:bg-stone-50"}`}
    title="Mark as helpful"
  >
                      <ThumbsUp className="w-3 h-3 text-[#881930]" />
                      <span className="font-mono">{item.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* 4. Carousel Pagination Dots */
  }
        {maxIndex > 0 && <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => <button
    key={i}
    onClick={() => setCurrentIndex(i)}
    className={`transition-all duration-300 rounded-full cursor-pointer ${currentIndex === i ? "w-6 h-2 bg-[#881930]" : "w-2 h-2 bg-stone-300 hover:bg-stone-400"}`}
    aria-label={`Slide to review ${i + 1}`}
  />)}
          </div>}
      </div>

      {
    /* 5. "WRITE A REVIEW" MODAL */
  }
      {isWriteReviewOpen && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div
    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
    onClick={() => setIsWriteReviewOpen(false)}
  />

            <div
    className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-lg p-6 sm:p-8 border border-stone-200 z-10 space-y-5 animate-scale-in"
    onClick={(e) => e.stopPropagation()}
  >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#881930] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Saree Sansar Patron Circle</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Share Your Experience (Write a Review)
                  </h3>
                </div>
                <button
    onClick={() => setIsWriteReviewOpen(false)}
    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
  >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {
    /* Rating Stars Picker */
  }
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => <button
    type="button"
    key={star}
    onClick={() => setFormRating(star)}
    onMouseEnter={() => setFormHoverRating(star)}
    onMouseLeave={() => setFormHoverRating(0)}
    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
  >
                        <Star
    className={`w-6 h-6 ${star <= (formHoverRating || formRating) ? "fill-current text-amber-500" : "text-stone-300"}`}
  />
                      </button>)}
                    <span className="text-xs font-bold text-stone-800 ml-2 font-mono">
                      {formHoverRating || formRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
    label="Your Full Name *"
    required
    value={formName}
    onChange={(e) => setFormName(e.target.value)}
    placeholder="e.g. Sunita Sharma"
  />
                  <Input
    label="City, State *"
    required
    value={formCity}
    onChange={(e) => setFormCity(e.target.value)}
    placeholder="e.g. New Delhi / Raipur"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Collection Category
                    </label>
                    <select
    value={formCategory}
    onChange={(e) => setFormCategory(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#881930] bg-white cursor-pointer"
  >
                      <option value="banarasi">Banarasi Silk</option>
                      <option value="bridal">Bridal &amp; Wedding</option>
                      <option value="kanjivaram">Kanjivaram</option>
                      <option value="festive">Festive &amp; Chanderi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Occasion
                    </label>
                    <input
    type="text"
    value={formOccasion}
    onChange={(e) => setFormOccasion(e.target.value)}
    placeholder="e.g. Wedding Reception / Diwali Puja"
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#881930]"
  />
                  </div>
                </div>

                <Input
    label="Review Headline *"
    required
    value={formTitle}
    onChange={(e) => setFormTitle(e.target.value)}
    placeholder="e.g. The drape received countless compliments at the wedding!"
  />

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Detailed Review *
                  </label>
                  <textarea
    rows={3}
    required
    value={formReview}
    onChange={(e) => setFormReview(e.target.value)}
    placeholder="Share your thoughts on the silk texture, zari craftsmanship, pallu details, packaging, and delivery..."
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#881930] leading-relaxed resize-none"
  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => setIsWriteReviewOpen(false)}
  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="px-5">
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    <span>Publish Review</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </section>;
};
