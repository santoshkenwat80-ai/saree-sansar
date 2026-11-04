import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";
import heroPalaceImg from "../../assets/images/hero_saree_royal_palace_1792385155671.jpg";
import kanjivaramImg from "../../assets/images/saree_kanjivaram_gold_1791698990300.jpg";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import banarasiBlueImg from "../../assets/images/saree_banarasi_blue_1791699014715.jpg";
import chanderiImg from "../../assets/images/saree_chanderi_pastel_1791699001746.jpg";
const HERO_SLIDES = [
  {
    id: "banarasi-palace",
    image: heroPalaceImg,
    kicker: "Imperial Heritage Looms \u2022 Varanasi & Kanchipuram",
    headline: "Handcrafted Sarees of Timeless Elegance, Woven by Master Artisans.",
    subheadline: "Centuries of Banarasi weaving heritage and the royal splendor of pure Katan silk in every thread.",
    description: "Immerse in the timeless opulence of pure Katan silk sarees, adorned with antique gold zari and kadhwa floral jaal, woven with generational mastery for majestic celebrations.",
    loomOrigin: "Varanasi, Uttar Pradesh",
    fabric: "Pure Katan Silk & Antique Zari",
    weaveDays: "38 Days on Handloom",
    tag: "Imperial Palace Collection",
    categorySlug: "banarasi-silk"
  },
  {
    id: "kanjivaram-temple",
    image: kanjivaramImg,
    kicker: "Sacred Temple Silks \u2022 Heirloom Mulberry Weaves",
    headline: "Sacred Temple Silks & Heavy Brocades for Life\u2019s Grandest Moments.",
    subheadline: "Authentic Kanchipuram silk featuring intricate temple borders and pure tested gold zari.",
    description: "Handcrafted using the ancient Korvai technique with interlocking ruby red temple borders, peacock motifs, and pure gold tested zari that lasts for generations.",
    loomOrigin: "Kanchipuram, Tamil Nadu",
    fabric: "Pure Mulberry Silk",
    weaveDays: "45 Days of Craftsmanship",
    tag: "Temple Zari Masterpiece",
    categorySlug: "kanjivaram-silk"
  },
  {
    id: "bridal-heritage",
    image: heroBridalImg,
    kicker: "The Imperial Bridal Trousseau \u2022 Vermillion & Gold",
    headline: "Draped in Royalty, Cherished for Generations to Come.",
    subheadline: "Imperial Bridal Trousseau, the most cherished and timeless attire for grand Indian celebrations.",
    description: "Heavy hand zardosi embellishments on crimson katan silk with ornate scalloped pallu borders, tailored exclusively for the royal Indian bride.",
    loomOrigin: "Heritage Bridal Looms",
    fabric: "Bridal Katan Silk Brocade",
    weaveDays: "60 Days of Precision",
    tag: "Royal Bridal Edition",
    categorySlug: "bridal-heritage"
  },
  {
    id: "banarasi-royal-blue",
    image: banarasiBlueImg,
    kicker: "Royal Blue Zari Brocade \u2022 Certified Silk Mark",
    headline: "Regal Midnight Silks with Radiant Metallic Luster.",
    subheadline: "Pure natural mulberry filaments interwoven with authentic silver and electroplated gold bullion.",
    description: "An exceptional drape capturing the night sky of royal courts, woven with dense floral meenakari accents and shimmering zari pallu.",
    loomOrigin: "Varanasi Master Looms",
    fabric: "100% Pure Mulberry Silk",
    weaveDays: "32 Days of Weaving",
    tag: "Royal Midnight Brocade",
    categorySlug: "banarasi-silk"
  },
  {
    id: "chanderi-organza",
    image: chanderiImg,
    kicker: "Airy Gossamer Handlooms \u2022 Chanderi & Organza",
    headline: "Featherlight Elegance Shimmering with Delicate Gold Ashrafi.",
    subheadline: "Breathable translucent silk cotton handwoven for daytime celebrations and summer soirees.",
    description: "Master weavers from Pranpur blend fine cotton warp and degummed silk weft to produce an ethereal translucent drape that floats like a whisper.",
    loomOrigin: "Pranpur & Chanderi, MP",
    fabric: "Handloom Silk-Cotton & Zari",
    weaveDays: "21 Days of Craftsmanship",
    tag: "Gossamer Chanderi Weave",
    categorySlug: "chanderi-organza"
  }
];
export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);
  const slide = HERO_SLIDES[currentSlide];
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };
  return <section
    className="relative overflow-hidden bg-stone-900 text-white select-none border-b border-stone-800"
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
    aria-label="Artisan Sarees Hero Showcase"
  >
      {
    /* 1. Background Saree Image Slideshow with Vivid Clarity & Soft Scrim */
  }
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((s, index) => <div
    key={s.id}
    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
  >
            <img
    src={s.image}
    alt={s.headline}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover object-[center_35%] lg:object-right transition-transform duration-8000 ease-out scale-100"
  />
          </div>)}

        {
    /* Soft, Transparent Scrim: Lets the background saree images remain clearly visible and vibrant */
  }
        {
    /* Horizontal scrim on the left for text readability, fully clear on the right */
  }
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-stone-950/75 via-stone-950/45 to-transparent sm:to-stone-950/20" />
        {
    /* Soft top and bottom fades */
  }
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/30" />

        {
    /* Subtle royal lattice accent texture */
  }
        <div className="absolute inset-0 z-20 opacity-15 bg-[radial-gradient(#f2ce6e_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      </div>

      {
    /* 2. Main Content Area */
  }
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 min-h-[600px] lg:min-h-[660px] flex flex-col justify-between">
        <div className="my-auto max-w-3xl">
          {
    /* Main Column: Clear, High-Contrast Typography over soft glass */
  }
          <div className="space-y-6 sm:space-y-7 animate-in fade-in slide-in-from-left-6 duration-700">
            {
    /* Overline / Kicker Badge in Glowing Warm Gold */
  }
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#f2ce6e]/50 backdrop-blur-md shadow-md">
              <Sparkles className="w-4 h-4 text-[#f2ce6e] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#f2ce6e]">
                {slide.kicker}
              </span>
            </div>

            {
    /* Compelling Headline in Crisp White & Luminous Gold */
  }
            <div className="space-y-2.5">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance drop-shadow-md">
                {slide.headline}
              </h1>
              <p className="font-serif text-base sm:text-xl text-[#f2ce6e] italic font-semibold leading-relaxed drop-shadow-sm">
                {slide.subheadline}
              </p>
            </div>

            {
    /* Description Paragraph with subtle backdrop card for perfect legibility */
  }
            <div className="p-4 rounded-xl bg-black/35 backdrop-blur-sm border border-white/10 max-w-2xl shadow-sm">
              <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-normal">
                {slide.description}
              </p>
            </div>

            {
    /* Primary & Secondary Call-to-Action Buttons */
  }
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
    to="/products"
    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#881930] hover:bg-[#a7233f] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl border border-[#f2ce6e]/40 transition-all duration-300 group cursor-pointer active:scale-95"
  >
                <span>Shop Collections</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              <Link
    to={`/products?category=${slide.categorySlug}`}
    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black/40 hover:bg-black/60 text-white border border-white/30 font-semibold text-sm rounded-xl transition-all duration-300 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
  >
                <span>Explore {slide.tag}</span>
              </Link>
            </div>

            {
    /* Interactive Theme Switcher Pills */
  }
            <div className="pt-2">
              <div className="flex items-center justify-between max-w-xl mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200/90 block">
                  Curated Artisan Weaves ({currentSlide + 1} of {HERO_SLIDES.length}):
                </span>
                <button
    type="button"
    onClick={() => setIsPaused((prev) => !prev)}
    className="text-[11px] font-medium text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
    title={isPaused ? "Resume Slideshow" : "Pause Slideshow"}
  >
                  {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-300" />}
                  <span>{isPaused ? "Paused" : "Slideshow Live"}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {HERO_SLIDES.map((s, idx) => <button
    key={s.id}
    type="button"
    onClick={() => setCurrentSlide(idx)}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${currentSlide === idx ? "bg-[#881930] text-white border border-[#f2ce6e]/80 shadow-md ring-1 ring-[#f2ce6e]/50" : "bg-black/40 hover:bg-black/60 text-stone-200 border border-white/20 shadow-xs backdrop-blur-xs"}`}
  >
                    <span
    className={`w-1.5 h-1.5 rounded-full ${currentSlide === idx ? "bg-[#f2ce6e]" : "bg-stone-400"}`}
  />
                    <span>{s.tag}</span>
                  </button>)}
              </div>
            </div>
          </div>
        </div>

        {
    /* 3. Bottom Slide Controls & Heritage Trust Bar */
  }
        <div className="pt-8 border-t border-white/15 space-y-5">
          {
    /* Controls: Prev / Next Buttons & Indicators */
  }
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {
    /* Slide Dots */
  }
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => <button
    key={idx}
    type="button"
    onClick={() => setCurrentSlide(idx)}
    className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? "w-8 bg-[#f2ce6e]" : "w-2 bg-white/40 hover:bg-white/70"}`}
    aria-label={`Go to slide ${idx + 1}`}
  />)}
            </div>

            {
    /* Prev / Next Arrows */
  }
            <div className="flex items-center gap-2">
              <button
    type="button"
    onClick={handlePrev}
    className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white border border-white/20 flex items-center justify-center transition-colors shadow-xs cursor-pointer backdrop-blur-sm"
    aria-label="Previous Slide"
  >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
    type="button"
    onClick={handleNext}
    className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white border border-white/20 flex items-center justify-center transition-colors shadow-xs cursor-pointer backdrop-blur-sm"
    aria-label="Next Slide"
  >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {
    /* Trust Guarantees Bar (Warm Royal Gold Accents) */
  }
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f2ce6e]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ce6e] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">100% Silk Mark</span>
                <span className="text-[11px] text-amber-200/90">Pure Indian Silks</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f2ce6e]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ce6e] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Direct Loom Fair Price</span>
                <span className="text-[11px] text-amber-200/90">No Middlemen Markup</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f2ce6e]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ce6e] shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Free Insured Delivery</span>
                <span className="text-[11px] text-amber-200/90">Across India + COD</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f2ce6e]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ce6e] shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">7-Day Easy Exchange</span>
                <span className="text-[11px] text-amber-200/90">Complete Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
