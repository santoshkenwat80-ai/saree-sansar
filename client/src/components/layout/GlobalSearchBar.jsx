import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Tag,
  Palette,
  Layers,
  CheckCircle2,
  Clock,
  SlidersHorizontal
} from "lucide-react";
import { productService } from "../../services/productService";
import { INITIAL_PRODUCTS } from "../../services/mockData";
import { formatINR } from "../../utils/currency";
const POPULAR_MATERIALS = [
  { label: "Banarasi Silk", query: "Banarasi Silk" },
  { label: "Kanjivaram Silk", query: "Kanjivaram Silk" },
  { label: "Chanderi", query: "Chanderi" },
  { label: "Georgette", query: "Georgette" },
  { label: "Organza", query: "Organza" },
  { label: "Tussar Silk", query: "Tussar" }
];
const POPULAR_COLORS = [
  { label: "Crimson Red", query: "Red", hex: "#991B1B" },
  { label: "Royal Blue", query: "Blue", hex: "#1E40AF" },
  { label: "Emerald Green", query: "Green", hex: "#065F46" },
  { label: "Mustard Gold", query: "Gold", hex: "#D97706" },
  { label: "Blush Pink", query: "Pink", hex: "#DB2777" },
  { label: "Plum Purple", query: "Purple", hex: "#7C3AED" }
];
export const GlobalSearchBar = ({
  variant = "desktop",
  className = "",
  onCloseMobile
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    productService.getProducts().then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setProductsList(prods);
      }
    }).catch(() => {
    });
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("q") || params.get("search");
    if (urlQuery && !query) {
      setQuery(urlQuery);
    }
  }, [location.search]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setIsFocused(false);
  }, [location.pathname]);
  const matchedProductsWithReasons = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];
    const results = [];
    for (const product of productsList) {
      const nameLower = (product.name || "").toLowerCase();
      const fabricLower = (product.fabric || "").toLowerCase();
      const colorLower = (product.color || "").toLowerCase();
      const weaveLower = (product.weavingTechnique || "").toLowerCase();
      const specFabric = (product.specifications?.Fabric || "").toLowerCase();
      const specMaterial = (product.specifications?.Material || "").toLowerCase();
      const specColor = (product.specifications?.Color || "").toLowerCase();
      const matchesName = nameLower.includes(cleanQuery);
      const matchesMaterial = fabricLower.includes(cleanQuery) || weaveLower.includes(cleanQuery) || specFabric.includes(cleanQuery) || specMaterial.includes(cleanQuery);
      const matchesColor = colorLower.includes(cleanQuery) || specColor.includes(cleanQuery);
      if (filterAttribute === "name" && matchesName) {
        results.push({ product, matchType: "name", matchLabel: product.name });
      } else if (filterAttribute === "material" && matchesMaterial) {
        results.push({ product, matchType: "material", matchLabel: product.fabric });
      } else if (filterAttribute === "color" && matchesColor) {
        results.push({ product, matchType: "color", matchLabel: product.color });
      } else if (filterAttribute === "all") {
        if (matchesName) {
          results.push({ product, matchType: "name", matchLabel: product.name });
        } else if (matchesMaterial) {
          results.push({ product, matchType: "material", matchLabel: product.fabric });
        } else if (matchesColor) {
          results.push({ product, matchType: "color", matchLabel: product.color });
        }
      }
    }
    return results;
  }, [query, filterAttribute, productsList]);
  const handleKeyDown = (e) => {
    if (!isFocused) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => prev < matchedProductsWithReasons.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => prev > 0 ? prev - 1 : matchedProductsWithReasons.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < matchedProductsWithReasons.length) {
        e.preventDefault();
        const selected = matchedProductsWithReasons[selectedIndex];
        handleSelectProduct(selected.product.slug || selected.product.id);
      } else {
        handleSearchSubmit(e);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    const searchParams = new URLSearchParams();
    searchParams.set("q", cleanQuery);
    if (filterAttribute !== "all") {
      searchParams.set("filterBy", filterAttribute);
    }
    navigate(`/products?${searchParams.toString()}`);
  };
  const handleSelectProduct = (slugOrId) => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    navigate(`/products/${slugOrId}`);
  };
  const handleQuickChipClick = (term, attribute) => {
    setQuery(term);
    if (attribute) {
      setFilterAttribute(attribute);
    }
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    const searchParams = new URLSearchParams();
    searchParams.set("q", term);
    if (attribute && attribute !== "all") {
      searchParams.set("filterBy", attribute);
    }
    navigate(`/products?${searchParams.toString()}`);
  };
  const isDesktop = variant === "desktop";
  return <div
    ref={containerRef}
    className={`relative ${isDesktop ? "w-full max-w-xl mx-2 lg:mx-4" : "w-full"} ${className}`}
  >
      {
    /* Search Input Container */
  }
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />

          <input
    ref={inputRef}
    type="text"
    value={query}
    onChange={(e) => {
      setQuery(e.target.value);
      setIsFocused(true);
      setSelectedIndex(-1);
    }}
    onFocus={() => setIsFocused(true)}
    onKeyDown={handleKeyDown}
    placeholder={filterAttribute === "name" ? "Search by Saree name..." : filterAttribute === "material" ? "Search by Material (Silk, Banarasi, Chanderi, Georgette)..." : filterAttribute === "color" ? "Search by Color (Red, Green, Gold, Blue, Pink)..." : "Search catalog by Name, Material, or Color..."}
    className={`w-full ${isDesktop ? "py-2.5 pl-10 pr-24 text-xs" : "py-2 pl-9 pr-20 text-xs"} bg-stone-50 hover:bg-stone-100/90 focus:bg-white text-stone-900 placeholder:text-stone-400 border border-stone-300 focus:border-[#881930] rounded-full focus:outline-none focus:ring-2 focus:ring-[#881930]/20 transition-all shadow-2xs`}
  />

          {
    /* Active Filter Badge if not 'all' */
  }
          {filterAttribute !== "all" && <span className="hidden sm:inline-flex items-center gap-1 absolute right-24 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-rose-50 text-[#881930] border border-rose-200 text-[10px] font-semibold rounded-full uppercase tracking-wider">
              {filterAttribute === "material" ? "\u{1F9F5} Material" : "\u{1F3A8} Color"}
            </span>}

          {
    /* Clear Query Button */
  }
          {query && <button
    type="button"
    onClick={() => {
      setQuery("");
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }}
    className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
    aria-label="Clear search query"
  >
              <X className="w-3.5 h-3.5" />
            </button>}

          {
    /* Search Action Button */
  }
          <button
    type="submit"
    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#881930] hover:bg-[#6b1426] text-white text-[11px] font-semibold rounded-full transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1"
  >
            <span>Search</span>
          </button>
        </div>
      </form>

      {
    /* Global Search Suggestions & Results Dropdown */
  }
      {isFocused && <div
    className={`absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 flex flex-col ${isDesktop ? "max-h-[490px]" : "max-h-[75vh]"}`}
  >
          {
    /* Header Bar: Filter by Attribute Tabs (Name / Material / Color / All) */
  }
          <div className="p-2.5 bg-gradient-to-r from-stone-50 to-[#FCF9F5] border-b border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-[#881930]" />
                Filter Catalog By:
              </span>
              <span className="text-[10px] text-stone-400">
                {query.trim() ? `${matchedProductsWithReasons.length} saree${matchedProductsWithReasons.length === 1 ? "" : "s"} found` : "Instant Catalog Filter"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
    type="button"
    onClick={() => setFilterAttribute("all")}
    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${filterAttribute === "all" ? "bg-[#881930] text-white shadow-2xs" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
  >
                <Sparkles className="w-3 h-3" />
                <span>All Attributes</span>
              </button>

              <button
    type="button"
    onClick={() => setFilterAttribute("name")}
    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${filterAttribute === "name" ? "bg-[#881930] text-white shadow-2xs" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
  >
                <Tag className="w-3 h-3" />
                <span>Name</span>
              </button>

              <button
    type="button"
    onClick={() => setFilterAttribute("material")}
    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${filterAttribute === "material" ? "bg-[#881930] text-white shadow-2xs" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
  >
                <Layers className="w-3 h-3" />
                <span>Material / Fabric</span>
              </button>

              <button
    type="button"
    onClick={() => setFilterAttribute("color")}
    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${filterAttribute === "color" ? "bg-[#881930] text-white shadow-2xs" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
  >
                <Palette className="w-3 h-3" />
                <span>Color</span>
              </button>
            </div>
          </div>

          {
    /* Results Area */
  }
          <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
            {query.trim().length > 0 ? matchedProductsWithReasons.length > 0 ? <div className="p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Sarees</span>
                    <span className="hidden sm:inline">Use ↑↓ keys to navigate</span>
                  </div>

                  {matchedProductsWithReasons.map((item, idx) => {
    const isSelected = selectedIndex === idx;
    const { product, matchType } = item;
    return <div
      key={product.id}
      onClick={() => handleSelectProduct(product.slug || product.id)}
      className={`p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${isSelected ? "bg-[#881930]/10 ring-1 ring-[#881930]/30" : "hover:bg-stone-50"}`}
    >
                        {
      /* Thumbnail */
    }
                        <div className="relative shrink-0">
                          <img
      src={product.images[0]}
      alt={product.name}
      className="w-12 h-14 object-cover rounded-lg border border-stone-200 shadow-2xs"
    />
                          {
      /* Color Swatch Dot */
    }
                          {product.colorHex && <span
      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
      style={{ backgroundColor: product.colorHex }}
      title={`Color: ${product.color}`}
    />}
                        </div>

                        {
      /* Info */
    }
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {product.name}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {
      /* Match Highlight Badge */
    }
                            {matchType === "material" && <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                <Layers className="w-2.5 h-2.5" />
                                <span>{product.fabric}</span>
                              </span>}

                            {matchType === "color" && <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                                <Palette className="w-2.5 h-2.5" />
                                <span>{product.color}</span>
                              </span>}

                            {matchType === "name" && <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                <span>{product.fabric}</span>
                              </span>}

                            {
      /* Color Tag if not already highlighted */
    }
                            {matchType !== "color" && product.color && <span className="text-[10px] text-stone-500 truncate max-w-[120px]">
                                · {product.color}
                              </span>}

                            {
      /* Stock Indicator */
    }
                            {product.stock > 0 && <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 font-medium ml-auto">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                In Stock
                              </span>}
                          </div>
                        </div>

                        {
      /* Pricing */
    }
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold font-mono text-[#881930]">
                            {formatINR(product.price)}
                          </p>
                          {product.originalPrice && <p className="text-[10px] font-mono text-stone-400 line-through">
                              {formatINR(product.originalPrice)}
                            </p>}
                        </div>
                      </div>;
  })}
                </div> : (
    /* No Results State with helpful suggestions */
    <div className="p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-800">
                      No sarees found matching "{query}"
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {filterAttribute === "material" ? "Try searching materials like Banarasi, Kanjivaram, Chanderi, Silk, or Organza" : filterAttribute === "color" ? "Try searching colors like Crimson, Emerald Green, Gold, Royal Blue, or Pink" : "Try searching by Saree name, handloom material, or color shade"}
                    </p>
                  </div>

                  {
      /* Reset to All Attributes */
    }
                  {filterAttribute !== "all" && <button
      type="button"
      onClick={() => setFilterAttribute("all")}
      className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-full transition-colors cursor-pointer"
    >
                      <Sparkles className="w-3 h-3 text-[#881930]" />
                      <span>Search across all attributes</span>
                    </button>}
                </div>
  ) : (
    /* Empty Query: Quick Material & Color Catalogs */
    <div className="p-3.5 space-y-3.5">
                {
      /* 1. Filter by Material */
    }
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Popular Materials (Fabrics)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_MATERIALS.map((mat) => <button
      key={mat.label}
      type="button"
      onClick={() => handleQuickChipClick(mat.query, "material")}
      className="px-2.5 py-1 bg-stone-50 hover:bg-[#881930] hover:text-white border border-stone-200 hover:border-[#881930] rounded-full text-[11px] text-stone-700 font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
    >
                        <span>{mat.label}</span>
                      </button>)}
                  </div>
                </div>

                {
      /* 2. Filter by Color */
    }
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                    <Palette className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Popular Colors (Shades)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_COLORS.map((col) => <button
      key={col.label}
      type="button"
      onClick={() => handleQuickChipClick(col.query, "color")}
      className="px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full text-[11px] text-stone-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs hover:border-stone-400"
    >
                        <span
      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
      style={{ backgroundColor: col.hex }}
    />
                        <span>{col.label}</span>
                      </button>)}
                  </div>
                </div>

                {
      /* 3. Popular Handloom Collections */
    }
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    Heritage Looms of Varanasi &amp; Kanchipuram
                  </span>
                  <button
      type="button"
      onClick={() => {
        setIsFocused(false);
        if (onCloseMobile) onCloseMobile();
        navigate("/products");
      }}
      className="text-[#881930] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
    >
                    <span>Browse All</span>
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
  )}
          </div>

          {
    /* Footer View All Results Button */
  }
          {query.trim().length > 0 && matchedProductsWithReasons.length > 0 && <div className="p-2.5 bg-stone-50 border-t border-stone-200 text-center">
              <button
    type="button"
    onClick={handleSearchSubmit}
    className="w-full py-2 px-4 bg-[#881930] hover:bg-[#6b1426] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
  >
                <span>
                  View all {matchedProductsWithReasons.length} results for "{query}"
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>}
        </div>}
    </div>;
};
const ChevronRightIcon = ({ className }) => <svg
  className={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
    <polyline points="9 18 15 12 9 6" />
  </svg>;
export default GlobalSearchBar;
