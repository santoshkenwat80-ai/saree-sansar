import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  IndianRupee,
  Sparkles,
  Palette,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Calendar,
  CheckCircle2,
  PackageCheck
} from "lucide-react";
import { formatINR } from "../../utils/currency";
export const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular", sublabel: "Featured Picks", icon: "\u2B50" },
  { id: "price-asc", label: "Price: Low to High", sublabel: "Budget Friendly", icon: "\u2191" },
  { id: "price-desc", label: "Price: High to Low", sublabel: "Luxury First", icon: "\u2193" },
  { id: "rating", label: "Highest Rated", sublabel: "Top Reviews", icon: "\u2605" },
  { id: "newest", label: "Newest Arrivals", sublabel: "Fresh Drops", icon: "\u2728" }
];
export const PRICE_BRACKETS = [
  { label: "All Prices", min: 0, max: 6e4, sublabel: "Complete Range" },
  { label: "Under \u20B910,000", min: 0, max: 1e4, sublabel: "Value Handloom" },
  { label: "\u20B910,000 \u2013 \u20B918,000", min: 1e4, max: 18e3, sublabel: "Festive & Occasion" },
  { label: "\u20B918,000 \u2013 \u20B925,000", min: 18e3, max: 25e3, sublabel: "Heritage Silks" },
  { label: "Above \u20B925,000", min: 25e3, max: 6e4, sublabel: "Royal Bridal" }
];
export const MATERIAL_OPTIONS = [
  { id: "all", name: "All Fabric Types", sublabel: "All Weaves & Fabrics" },
  { id: "Silk", name: "Silk Sarees", sublabel: "Pure Katan, Mulberry & Kanjivaram", badge: "Pure Silk" },
  { id: "Georgette", name: "Georgette Sarees", sublabel: "Khaddi & Pure Banarasi Georgette", badge: "Fluid & Drapey" },
  { id: "Chiffon", name: "Chiffon Sarees", sublabel: "Lightweight & Sheer Chiffon", badge: "Light & Airy" },
  { id: "Cotton", name: "Cotton Sarees", sublabel: "Handloom Pure Cotton & Jamdani", badge: "Breathable" },
  { id: "Chanderi", name: "Chanderi Sarees", sublabel: "Tissue Zari & Chanderi Weaves", badge: "Lustrous Sheer" },
  { id: "Organza", name: "Organza Sarees", sublabel: "Gossamer Silk Organza", badge: "Ethereal Sheer" },
  { id: "Tussar", name: "Tussar & Kosa Silk", sublabel: "Wild Handspun Champa Silk", badge: "Heritage Kosa" }
];
export const OCCASION_OPTIONS = [
  { id: "all", name: "All Occasions", sublabel: "All Events" },
  { id: "Wedding", name: "Wedding", sublabel: "Bridal & Trousseau", badge: "Bridal & Trousseau" },
  { id: "Festive", name: "Festive", sublabel: "Diwali & Pooja", badge: "Diwali & Pooja" },
  { id: "Casual", name: "Casual", sublabel: "Office & Everyday", badge: "Office & Everyday" },
  { id: "Party Wear", name: "Party Wear", sublabel: "Evening Soiree", badge: "Evening Soiree" }
];
export const COLOR_OPTIONS = [
  { id: "all", name: "All Colors", sublabel: "All Shades", hex: "#64748B" },
  { id: "red", name: "Red & Maroon", sublabel: "Bridal Red", hex: "#881930" },
  { id: "pink", name: "Rani & Rose Pink", sublabel: "Rose Pink", hex: "#DB2777" },
  { id: "blue", name: "Royal Navy Blue", sublabel: "Navy Blue", hex: "#1E3A8A" },
  { id: "green", name: "Emerald Green", sublabel: "Emerald Green", hex: "#047857" },
  { id: "yellow", name: "Mustard & Yellow", sublabel: "Mustard Yellow", hex: "#D97706" },
  { id: "white", name: "Ivory & Cream", sublabel: "Ivory Cream", hex: "#F8F6F0", dotBorder: true },
  { id: "gold", name: "Gold & Zari", sublabel: "Gold Zari", hex: "#D4AF37" },
  { id: "purple", name: "Plum & Purple", sublabel: "Royal Purple", hex: "#7E22CE" }
];
export const CATEGORY_OPTIONS = [
  { slug: "all", name: "All Categories", sublabel: "All Sarees" },
  { slug: "banarasi-silk", name: "Banarasi Silk", sublabel: "Varanasi" },
  { slug: "kanjivaram-silk", name: "Kanjivaram Silk", sublabel: "Kanchipuram" },
  { slug: "chanderi-organza", name: "Chanderi & Organza", sublabel: "Chanderi" },
  { slug: "georgette-chiffon", name: "Georgette & Chiffon", sublabel: "Khaddi Georgette" },
  { slug: "bridal-heritage", name: "Bridal Heritage", sublabel: "Trousseau" },
  { slug: "handloom-cotton", name: "Handloom Cotton", sublabel: "Pure Cotton" }
];
export const SidebarFilter = ({
  filters,
  onChange,
  onReset,
  totalResults,
  className = "",
  isMobileModal = false,
  onCloseMobile,
  currentSort = "popular",
  onSortChange
}) => {
  const [isMaterialExpanded, setIsMaterialExpanded] = useState(true);
  const [isOccasionExpanded, setIsOccasionExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isColorExpanded, setIsColorExpanded] = useState(false);
  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [customMin, setCustomMin] = useState(filters.minPrice > 0 ? String(filters.minPrice) : "");
  const [customMax, setCustomMax] = useState(
    filters.maxPrice < 6e4 ? String(filters.maxPrice) : ""
  );
  const activeSort = filters.sortBy || currentSort || "popular";
  const handleSortSelect = (sortId) => {
    if (onSortChange) onSortChange(sortId);
    onChange({ ...filters, sortBy: sortId });
  };
  const handleMaterialSelect = (materialId) => {
    onChange({
      ...filters,
      fabricType: materialId === filters.fabricType ? "all" : materialId
    });
  };
  const handleOccasionSelect = (occasionId) => {
    onChange({
      ...filters,
      occasion: occasionId === filters.occasion ? "all" : occasionId
    });
  };
  const handleColorSelect = (colorId) => {
    onChange({
      ...filters,
      color: colorId === filters.color ? "all" : colorId
    });
  };
  const handleCategorySelect = (categorySlug) => {
    onChange({
      ...filters,
      category: categorySlug === filters.category ? "all" : categorySlug
    });
  };
  const handlePriceRangeChange = (maxVal) => {
    setCustomMax(String(maxVal));
    onChange({ ...filters, maxPrice: maxVal });
  };
  const handlePriceBracketSelect = (min, max) => {
    setCustomMin(min > 0 ? String(min) : "");
    setCustomMax(max < 6e4 ? String(max) : "");
    onChange({ ...filters, minPrice: min, maxPrice: max });
  };
  const handleApplyCustomPrice = (e) => {
    e.preventDefault();
    const min = Number(customMin) || 0;
    const max = Number(customMax) || 6e4;
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max >= min ? max : min + 1e3
    });
  };
  const hasActiveFilters = filters.fabricType && filters.fabricType !== "all" || filters.occasion && filters.occasion !== "all" || filters.color && filters.color !== "all" || filters.category && filters.category !== "all" || filters.minPrice > 0 || filters.maxPrice < 6e4 || filters.inStockOnly;
  return <div className={`bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden ${className}`}>
      {
    /* 1. Header with Results Counter & Reset */
  }
      <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-gradient-to-r from-[#FCF9F5] to-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#881930]/10 text-[#881930]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">
              Filter Sarees
            </h3>
            {totalResults !== void 0 && <span className="text-[11px] text-stone-500 font-medium">
                <span className="font-semibold text-stone-900 font-mono">{totalResults}</span> Handcrafted drapes
              </span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && <button
    type="button"
    onClick={onReset}
    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#881930] hover:text-[#520f1d] px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
    title="Reset all filters"
  >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>}

          {isMobileModal && onCloseMobile && <button
    type="button"
    onClick={onCloseMobile}
    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
    aria-label="Close filters"
  >
              <X className="w-5 h-5" />
            </button>}
        </div>
      </div>

      {
    /* 2. Active Filters Pill Chips */
  }
      {hasActiveFilters && <div className="p-3 bg-stone-50/90 border-b border-stone-200/60 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
            Active:
          </span>

          {
    /* Material Tag */
  }
          {filters.fabricType && filters.fabricType !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#881930] text-white rounded-full text-xs font-medium shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#f2ce6e]" />
              <span>Material: {filters.fabricType}</span>
              <button
    type="button"
    onClick={() => handleMaterialSelect(filters.fabricType)}
    className="hover:text-rose-200 cursor-pointer ml-0.5"
    aria-label="Remove material filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Occasion Tag */
  }
          {filters.occasion && filters.occasion !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#a07817] text-white rounded-full text-xs font-medium shadow-2xs">
              <Calendar className="w-3 h-3 text-white" />
              <span>Occasion: {filters.occasion}</span>
              <button
    type="button"
    onClick={() => handleOccasionSelect(filters.occasion)}
    className="hover:text-amber-200 cursor-pointer ml-0.5"
    aria-label="Remove occasion filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Price Range Tag */
  }
          {(filters.minPrice > 0 || filters.maxPrice && filters.maxPrice < 6e4) && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-[#881930] border border-rose-200 rounded-full text-xs font-medium shadow-2xs">
              <IndianRupee className="w-3 h-3" />
              <span>
                {formatINR(filters.minPrice || 0)} – {formatINR(filters.maxPrice || 6e4)}
              </span>
              <button
    type="button"
    onClick={() => onChange({ ...filters, minPrice: 0, maxPrice: 6e4 })}
    className="hover:text-red-700 cursor-pointer ml-0.5"
    aria-label="Remove price filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Category Tag */
  }
          {filters.category && filters.category !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-800 text-stone-100 rounded-full text-xs font-medium shadow-2xs">
              <Layers className="w-3 h-3 text-[#d4af37]" />
              <span>{filters.category.replace(/-/g, " ")}</span>
              <button
    type="button"
    onClick={() => handleCategorySelect(filters.category)}
    className="hover:text-stone-300 cursor-pointer ml-0.5"
    aria-label="Remove category filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}
        </div>}

      {
    /* 3. Main Filter Sections */
  }
      <div className="p-4 sm:p-5 space-y-5 divide-y divide-stone-100">
        {
    /* ========================================================= */
  }
        {
    /* SECTION 1: MATERIAL FILTER (Silk, Cotton, Chiffon, etc.) */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-1">
          <button
    type="button"
    onClick={() => setIsMaterialExpanded(!isMaterialExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-2 text-stone-900">
              <Sparkles className="w-3.5 h-3.5 text-[#881930] group-hover:rotate-12 transition-transform" />
              <span>Fabric / Material Type</span>
            </div>
            {isMaterialExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          <p className="text-[11px] text-stone-500 mb-2 leading-tight">
            Filter by Pure Silk, Georgette, Chiffon, Cotton, Chanderi &amp; Organza
          </p>

          {isMaterialExpanded && <div className="space-y-1.5 mt-2">
              {MATERIAL_OPTIONS.map((mat) => {
    const isSelected = mat.id === "all" ? !filters.fabricType || filters.fabricType === "all" : filters.fabricType?.toLowerCase() === mat.id.toLowerCase();
    return <button
      key={mat.id}
      type="button"
      onClick={() => handleMaterialSelect(mat.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "bg-stone-50/70 hover:bg-[#FCF9F5] text-stone-700 hover:text-[#6b1426] border border-stone-200/50"}`}
    >
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">{mat.name}</span>
                      <span className={`text-[10px] ${isSelected ? "text-rose-200" : "text-stone-400"}`}>
                        {mat.sublabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {mat.badge && <span
      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isSelected ? "bg-white/20 text-white font-semibold" : "bg-stone-100 text-stone-500"}`}
    >
                          {mat.badge}
                        </span>}
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-200 shrink-0" />}
                    </div>
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION 2: OCCASION FILTER (Wedding, Festive, Casual)     */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsOccasionExpanded(!isOccasionExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-2 text-stone-900">
              <Calendar className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Occasion</span>
            </div>
            {isOccasionExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          <p className="text-[11px] text-stone-500 mb-2 leading-tight">
            Grand Wedding, Festive rituals or Casual comfort
          </p>

          {isOccasionExpanded && <div className="space-y-1.5 mt-2">
              {OCCASION_OPTIONS.map((occ) => {
    const isSelected = occ.id === "all" ? !filters.occasion || filters.occasion === "all" : filters.occasion?.toLowerCase() === occ.id.toLowerCase();
    return <button
      key={occ.id}
      type="button"
      onClick={() => handleOccasionSelect(occ.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "bg-stone-50/70 hover:bg-[#FCF9F5] text-stone-700 hover:text-[#6b1426] border border-stone-200/50"}`}
    >
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">{occ.name}</span>
                      <span className={`text-[10px] ${isSelected ? "text-rose-200" : "text-stone-400"}`}>
                        {occ.sublabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {occ.badge && <span
      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isSelected ? "bg-white/20 text-white font-semibold" : "bg-stone-100 text-stone-500"}`}
    >
                          {occ.badge}
                        </span>}
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-200 shrink-0" />}
                    </div>
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION 3: PRICE RANGE FILTER                             */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsPriceExpanded(!isPriceExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-2 text-stone-900">
              <IndianRupee className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Price Range</span>
            </div>
            {isPriceExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isPriceExpanded && <div className="space-y-4 mt-2.5">
              {
    /* Range Slider Indicator */
  }
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-mono">
                    {filters.minPrice > 0 ? formatINR(filters.minPrice) : "\u20B90"}
                  </span>
                  <span className="font-bold text-[#881930] font-mono text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shadow-2xs">
                    Up to {formatINR(filters.maxPrice || 6e4)}
                  </span>
                  <span className="text-stone-500 font-mono">₹60,000+</span>
                </div>
                <input
    type="range"
    min="5000"
    max="60000"
    step="1000"
    value={filters.maxPrice || 6e4}
    onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
    className="w-full accent-[#881930] cursor-pointer"
    aria-label="Filter max price"
  />
              </div>

              {
    /* Price Brackets Buttons */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {PRICE_BRACKETS.map((bracket) => {
    const isSelected = filters.minPrice === bracket.min && (filters.maxPrice === bracket.max || !filters.maxPrice && bracket.max === 6e4);
    return <button
      key={bracket.label}
      type="button"
      onClick={() => handlePriceBracketSelect(bracket.min, bracket.max)}
      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-left transition-all cursor-pointer ${isSelected ? "bg-[#f5eedf] text-[#6b1426] font-bold border border-[#d4af37] shadow-2xs" : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/70"}`}
    >
                      <div className="leading-tight">{bracket.label}</div>
                      <div className="text-[9px] text-stone-400 mt-0.5">{bracket.sublabel}</div>
                    </button>;
  })}
              </div>

              {
    /* Custom Min / Max Inputs */
  }
              <form onSubmit={handleApplyCustomPrice} className="pt-2 border-t border-stone-100 space-y-2">
                <div className="text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>Custom Budget (₹):</span>
                  <span className="text-[10px] text-stone-400">Enter range</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
    type="number"
    placeholder="Min ₹"
    value={customMin}
    onChange={(e) => setCustomMin(e.target.value)}
    className="w-1/2 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] focus:bg-white"
  />
                  <span className="text-stone-400 text-xs">–</span>
                  <input
    type="number"
    placeholder="Max ₹"
    value={customMax}
    onChange={(e) => setCustomMax(e.target.value)}
    className="w-1/2 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] focus:bg-white"
  />
                  <button
    type="submit"
    className="px-3 py-1.5 bg-[#881930] hover:bg-[#6b1426] text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs"
  >
                    Go
                  </button>
                </div>
              </form>
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION 4: COLOR FILTER                                   */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsColorExpanded(!isColorExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-2 text-stone-900">
              <Palette className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Saree Color</span>
            </div>
            {isColorExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isColorExpanded && <div className="grid grid-cols-3 gap-1.5 mt-2.5">
              {COLOR_OPTIONS.map((c) => {
    const isSelected = c.id === "all" ? !filters.color || filters.color === "all" : filters.color?.toLowerCase() === c.id.toLowerCase();
    return <button
      key={c.id}
      type="button"
      onClick={() => handleColorSelect(c.id)}
      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1 items-start ${isSelected ? "border-[#881930] bg-rose-50/60 ring-1 ring-[#881930]/30" : "border-stone-200/70 hover:border-stone-300 bg-stone-50/50"}`}
    >
                    <div className="flex items-center justify-between w-full">
                      <span
      className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 shrink-0"
      style={{ backgroundColor: c.hex }}
    />
                      {isSelected && <Check className="w-3 h-3 text-[#881930]" />}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-800 truncate w-full">
                      {c.name.split(" ")[0]}
                    </span>
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION 5: SORT SAREES                                    */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsSortExpanded(!isSortExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-2 text-stone-900">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Sort By</span>
            </div>
            {isSortExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isSortExpanded && <div className="space-y-1 mt-2.5">
              {SORT_OPTIONS.map((opt) => {
    const isSelected = activeSort === opt.id;
    return <button
      key={opt.id}
      type="button"
      onClick={() => handleSortSelect(opt.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "text-stone-700 hover:bg-[#FCF9F5] hover:text-[#6b1426]"}`}
    >
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-rose-200 shrink-0" /> : <span className="text-[10px] text-stone-400">{opt.sublabel}</span>}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION 6: IN-STOCK ONLY TOGGLE                           */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-4">
          <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100/70 border border-stone-200/80 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-stone-900">In Stock Ready to Ship</span>
                <span className="text-[10px] text-stone-500">Dispatched within 24 Hours</span>
              </div>
            </div>
            <input
    type="checkbox"
    checked={filters.inStockOnly || false}
    onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
    className="w-4 h-4 rounded text-[#881930] focus:ring-[#881930] accent-[#881930] cursor-pointer"
  />
          </label>
        </div>
      </div>

      {
    /* 4. Mobile Modal Sticky Footer */
  }
      {isMobileModal && <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-2 sticky bottom-0 z-10 shadow-lg">
          <button
    type="button"
    onClick={onReset}
    className="flex-1 py-2.5 px-3 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-50 text-center"
  >
            Clear All
          </button>
          <button
    type="button"
    onClick={onCloseMobile}
    className="flex-2 py-2.5 px-4 bg-[#881930] text-white text-xs font-bold rounded-xl hover:bg-[#6b1426] shadow-sm text-center"
  >
            Show {totalResults ?? ""} Sarees
          </button>
        </div>}
    </div>;
};
