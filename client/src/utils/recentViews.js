import heroBridalImg from "../assets/images/hero_banarasi_bridal_1791698980254.jpg";
export const RECENTLY_VIEWED_KEY = "saree_sansar_recently_viewed";
export const MAX_HISTORY = 8;
export const SESSION_RECENTLY_VIEWED_KEY = "saree_sansar_session_recently_viewed";
export const MAX_SESSION_RECENTLY_VIEWED = 5;
export const recordSessionProductView = (product) => {
  if (!product || !product.id) return;
  try {
    const raw = sessionStorage.getItem(SESSION_RECENTLY_VIEWED_KEY);
    let items = raw ? JSON.parse(raw) : [];
    items = items.filter((item) => item.id !== product.id);
    const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [heroBridalImg];
    const newSessionItem = {
      ...product,
      images,
      viewedAt: Date.now()
    };
    items.unshift(newSessionItem);
    if (items.length > MAX_SESSION_RECENTLY_VIEWED) {
      items = items.slice(0, MAX_SESSION_RECENTLY_VIEWED);
    }
    sessionStorage.setItem(SESSION_RECENTLY_VIEWED_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("saree_session_recently_viewed_changed", { detail: newSessionItem })
    );
  } catch (err) {
    console.warn("Failed to record session product view:", err);
  }
};
export const getSessionRecentlyViewed = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (Array.isArray(items)) {
      return items.slice(0, MAX_SESSION_RECENTLY_VIEWED);
    }
    return [];
  } catch {
    return [];
  }
};
export const clearSessionRecentlyViewed = () => {
  try {
    sessionStorage.removeItem(SESSION_RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent("saree_session_recently_viewed_changed"));
  } catch (e) {
    console.warn(e);
  }
};
export const removeSessionRecentlyViewedItem = (productId) => {
  try {
    const items = getSessionRecentlyViewed().filter((item) => item.id !== productId);
    sessionStorage.setItem(SESSION_RECENTLY_VIEWED_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("saree_session_recently_viewed_changed"));
  } catch (e) {
    console.warn(e);
  }
};
export const recordProductView = (product) => {
  if (!product || !product.id) return;
  recordSessionProductView(product);
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items = raw ? JSON.parse(raw) : [];
    items = items.filter((item) => item.id !== product.id);
    const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image || heroBridalImg;
    const newItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      fabric: product.fabric,
      category: product.category,
      occasion: typeof product.occasion === "string" ? product.occasion : void 0,
      weavingTechnique: product.weavingTechnique,
      price: product.price,
      image,
      timestamp: Date.now()
    };
    items.unshift(newItem);
    if (items.length > MAX_HISTORY) {
      items = items.slice(0, MAX_HISTORY);
    }
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("saree_viewed_changed", { detail: newItem }));
  } catch (err) {
    console.warn("Failed to record product view:", err);
  }
};
export const getRecentlyViewedItems = () => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};
export const clearRecentlyViewedHistory = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent("saree_viewed_changed"));
  } catch (e) {
    console.warn(e);
  }
};
export const computeRecommendedProducts = (allProducts, limit = 4) => {
  if (!allProducts || allProducts.length === 0) {
    return {
      products: [],
      basedOnItem: null,
      rationale: "Curated royal weaves",
      hasViewHistory: false
    };
  }
  const viewedItems = getRecentlyViewedItems();
  const viewedIds = new Set(viewedItems.map((v) => v.id));
  if (viewedItems.length > 0) {
    const primaryAnchor = viewedItems[0];
    const candidatePool = allProducts.filter((p) => !viewedIds.has(p.id));
    const pool = candidatePool.length >= limit ? candidatePool : allProducts;
    const recentSample = viewedItems.slice(0, 3);
    const fabricCounts = {};
    const categoryCounts = {};
    const occasionCounts = {};
    let totalViewedPrice = 0;
    recentSample.forEach((item) => {
      if (item.fabric) fabricCounts[item.fabric.toLowerCase()] = (fabricCounts[item.fabric.toLowerCase()] || 0) + 1;
      if (item.category) categoryCounts[item.category.toLowerCase()] = (categoryCounts[item.category.toLowerCase()] || 0) + 1;
      if (item.occasion) occasionCounts[item.occasion.toLowerCase()] = (occasionCounts[item.occasion.toLowerCase()] || 0) + 1;
      totalViewedPrice += item.price;
    });
    const avgPrice = totalViewedPrice / recentSample.length;
    const scored = pool.map((prod) => {
      let score = 0;
      const prodFabric = (prod.fabric || "").toLowerCase();
      const prodCategory = (prod.category || "").toLowerCase();
      const prodOccasion = (prod.occasion || "").toLowerCase();
      const prodWeave = (prod.weavingTechnique || "").toLowerCase();
      if (primaryAnchor.fabric && prodFabric === primaryAnchor.fabric.toLowerCase()) {
        score += 6;
      } else if (fabricCounts[prodFabric]) {
        score += 3 * fabricCounts[prodFabric];
      }
      if (primaryAnchor.category && prodCategory === primaryAnchor.category.toLowerCase()) {
        score += 4;
      } else if (categoryCounts[prodCategory]) {
        score += 2 * categoryCounts[prodCategory];
      }
      if (primaryAnchor.weavingTechnique && prodWeave && prodWeave.includes(primaryAnchor.weavingTechnique.toLowerCase())) {
        score += 3;
      }
      if (primaryAnchor.occasion && prodOccasion === primaryAnchor.occasion.toLowerCase()) {
        score += 2;
      }
      if (avgPrice > 0 && Math.abs(prod.price - avgPrice) / avgPrice <= 0.35) {
        score += 2;
      }
      if (prod.rating >= 4.8) {
        score += 1;
      }
      if (prod.isBestSeller) {
        score += 1;
      }
      return { product: prod, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const recommended = scored.slice(0, limit).map((s) => s.product);
    let rationale = `Based on your interest in ${primaryAnchor.fabric}`;
    if (primaryAnchor.occasion) {
      rationale = `Curated for your ${primaryAnchor.occasion} inspiration \xB7 Inspired by ${primaryAnchor.fabric}`;
    } else if (primaryAnchor.name) {
      rationale = `Similar handloom masterpieces inspired by "${primaryAnchor.name.split(" ").slice(0, 3).join(" ")}"`;
    }
    return {
      products: recommended,
      basedOnItem: primaryAnchor,
      rationale,
      hasViewHistory: true
    };
  }
  const defaultPicks = allProducts.filter((p) => p.isBestSeller || p.isFeatured || p.rating >= 4.8).slice(0, limit);
  return {
    products: defaultPicks.length >= limit ? defaultPicks : allProducts.slice(0, limit),
    basedOnItem: null,
    rationale: "Handpicked heirloom drapes trending among royal patrons",
    hasViewHistory: false
  };
};
