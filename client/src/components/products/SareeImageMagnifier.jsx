import { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Move,
  Eye,
  Crosshair,
  Share2,
  Info,
  ShieldCheck,
  Layers,
  X
} from "lucide-react";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
export const SareeImageMagnifier = ({
  src,
  alt,
  fabricName = "Handloom Pure Silk",
  className = "",
  onShare,
  silkMark = true
}) => {
  const [zoomMode, setZoomMode] = useState("loupe");
  const [zoomLevel, setZoomLevel] = useState(3.5);
  const [showTextureGrid, setShowTextureGrid] = useState(false);
  const fallbackImage = heroBridalImg;
  const effectiveSrc = src && typeof src === "string" && src.trim().length > 0 ? src : fallbackImage;
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [relativePos, setRelativePos] = useState({
    xPercent: 50,
    yPercent: 50
  });
  const [containerSize, setContainerSize] = useState({
    width: 480,
    height: 640
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(3);
  const [fullscreenPan, setFullscreenPan] = useState({ x: 0, y: 0 });
  const [isDraggingFs, setIsDraggingFs] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const loupeSize = 190;
  const loupeRadius = loupeSize / 2;
  const updateContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: rect.width || 480,
        height: rect.height || 640
      });
    }
  }, []);
  useEffect(() => {
    updateContainerDimensions();
    window.addEventListener("resize", updateContainerDimensions);
    return () => window.removeEventListener("resize", updateContainerDimensions);
  }, [updateContainerDimensions]);
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const clampedY = Math.max(0, Math.min(y, rect.height));
      const xPercent = clampedX / rect.width * 100;
      const yPercent = clampedY / rect.height * 100;
      setMousePos({ x: clampedX, y: clampedY });
      setRelativePos({ xPercent, yPercent });
      setContainerSize({ width: rect.width, height: rect.height });
    },
    []
  );
  const handleMouseEnter = () => {
    updateContainerDimensions();
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    setActiveHotspot(null);
  };
  const handleFocusZone = (zone) => {
    setActiveHotspot(zone);
    setIsHovering(true);
    updateContainerDimensions();
    const w = containerSize.width || 480;
    const h = containerSize.height || 640;
    if (zone === "pallu") {
      setRelativePos({ xPercent: 68, yPercent: 24 });
      setMousePos({ x: w * 0.68, y: h * 0.24 });
    } else if (zone === "border") {
      setRelativePos({ xPercent: 25, yPercent: 78 });
      setMousePos({ x: w * 0.25, y: h * 0.78 });
    } else if (zone === "zari") {
      setRelativePos({ xPercent: 72, yPercent: 55 });
      setMousePos({ x: w * 0.72, y: h * 0.55 });
    } else {
      setRelativePos({ xPercent: 50, yPercent: 48 });
      setMousePos({ x: w * 0.5, y: h * 0.48 });
    }
  };
  const handleFsMouseDown = (e) => {
    setIsDraggingFs(true);
    setDragStart({ x: e.clientX - fullscreenPan.x, y: e.clientY - fullscreenPan.y });
  };
  const handleFsMouseMove = (e) => {
    if (!isDraggingFs) return;
    setFullscreenPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  const handleFsMouseUp = () => setIsDraggingFs(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);
  const bgWidth = containerSize.width * zoomLevel;
  const bgHeight = containerSize.height * zoomLevel;
  const loupeBgX = loupeRadius - mousePos.x * zoomLevel;
  const loupeBgY = loupeRadius - mousePos.y * zoomLevel;
  const sidePortalWidth = 440;
  const sidePortalHeight = 540;
  const sideBgX = sidePortalWidth / 2 - mousePos.x * zoomLevel;
  const sideBgY = sidePortalHeight / 2 - mousePos.y * zoomLevel;
  return <div className={`relative flex flex-col select-none ${className}`}>
      {
    /* Main Image Viewport with Hover Zoom */
  }
      <div
    ref={containerRef}
    onMouseMove={handleMouseMove}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onTouchMove={handleMouseMove}
    onTouchStart={handleMouseEnter}
    onTouchEnd={handleMouseLeave}
    className={`relative aspect-3/4 w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm transition-all ${zoomMode === "loupe" && isHovering ? "cursor-none" : "cursor-crosshair"}`}
  >
        {
    /* Base Image */
  }
        <img
    ref={imageRef}
    src={effectiveSrc}
    alt={alt}
    referrerPolicy="no-referrer"
    className={`w-full h-full object-cover object-top transition-transform duration-150 ${zoomMode === "inner" && isHovering ? "scale-[2.4]" : "scale-100"}`}
    style={zoomMode === "inner" && isHovering ? {
      transformOrigin: `${relativePos.xPercent}% ${relativePos.yPercent}%`,
      transform: `scale(${zoomLevel})`
    } : void 0}
  />

        {
    /* ======================================================== */
  }
        {
    /* MODE 1: CIRCULAR OPTICAL MAGNIFYING GLASS / LOUPE LENS   */
  }
        {
    /* ======================================================== */
  }
        {zoomMode === "loupe" && isHovering && <div
    className="pointer-events-none absolute rounded-full shadow-2xl border-[3px] border-[#f2ce6e] ring-4 ring-[#881930]/50 overflow-hidden z-30 transition-transform duration-75"
    style={{
      width: `${loupeSize}px`,
      height: `${loupeSize}px`,
      left: `${mousePos.x - loupeRadius}px`,
      top: `${mousePos.y - loupeRadius}px`,
      backgroundImage: `url(${effectiveSrc})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `${loupeBgX}px ${loupeBgY}px`,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.65), inset 0 0 35px rgba(0, 0, 0, 0.35), inset 0 2px 6px rgba(255, 255, 255, 0.7)"
    }}
  >
            {
    /* Loupe Glass Polish Reflection & Subtle Lens Curve */
  }
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/35 pointer-events-none" />

            {
    /* Precision Zari Alignment Crosshair */
  }
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45">
              <div className="w-6 h-[1.5px] bg-[#f2ce6e] shadow-xs" />
              <div className="h-6 w-[1.5px] bg-[#f2ce6e] absolute shadow-xs" />
            </div>

            {
    /* Optical Zoom Power Tag */
  }
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-xs text-[9px] font-mono font-bold text-amber-300 border border-amber-500/50 shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#f2ce6e]" />
              <span>{zoomLevel}x Micro Weave Loupe</span>
            </div>
          </div>}

        {
    /* ======================================================== */
  }
        {
    /* MODE 2: SIDE-BY-SIDE FLOATING INSPECTION PORTAL (Desktop) */
  }
        {
    /* ======================================================== */
  }
        {zoomMode === "side" && isHovering && <>
            {
    /* Shaded Target Frame on Base Saree */
  }
            <div
    className="pointer-events-none absolute border-2 border-[#881930] bg-[#881930]/20 shadow-md z-20 backdrop-brightness-110"
    style={{
      width: `${sidePortalWidth / zoomLevel}px`,
      height: `${sidePortalHeight / zoomLevel}px`,
      left: `${Math.max(
        0,
        Math.min(
          mousePos.x - sidePortalWidth / (2 * zoomLevel),
          containerSize.width - sidePortalWidth / zoomLevel
        )
      )}px`,
      top: `${Math.max(
        0,
        Math.min(
          mousePos.y - sidePortalHeight / (2 * zoomLevel),
          containerSize.height - sidePortalHeight / zoomLevel
        )
      )}px`
    }}
  />

            {
    /* Large High-Definition Side Portal */
  }
            <div
    className="hidden lg:block absolute left-[103%] top-0 rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-stone-900 shadow-2xl z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-150 ring-1 ring-stone-900/10"
    style={{
      width: `${sidePortalWidth}px`,
      height: `${sidePortalHeight}px`,
      backgroundImage: `url(${effectiveSrc})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `${sideBgX}px ${sideBgY}px`
    }}
  >
              {
    /* Header inside side portal */
  }
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/50 text-white text-xs font-serif flex items-center gap-2 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-200">
                  Handloom Weave Inspection ({zoomLevel}x Micro-Zoom)
                </span>
              </div>

              {
    /* Bottom detail summary */
  }
              <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-stone-700 text-[11px] text-stone-200 flex items-center justify-between shadow-lg">
                <span className="font-semibold text-amber-100">{fabricName}</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Authentic Zari & Pure Silk
                </span>
              </div>
            </div>
          </>}

        {
    /* Top Badges: Silk Mark & Inspection Mode */
  }
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {silkMark && <div className="bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#a07817]" />
              <span>Silk Mark Authenticated</span>
            </div>}

          {
    /* Quick Zari Inspection Pill */
  }
          <div className="bg-stone-900/85 backdrop-blur-md text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1 w-fit shadow-xs">
            <Eye className="w-3 h-3 text-amber-300" />
            <span>Kadhwa Weave Inspection</span>
          </div>
        </div>

        {
    /* Top Right Tool Buttons */
  }
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {
    /* Fullscreen Button */
  }
          <button
    type="button"
    onClick={() => setIsFullscreen(true)}
    className="p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 rounded-full shadow-md transition-all cursor-pointer hover:scale-105 border border-stone-200/60"
    title="Open Fullscreen Fabric Inspection"
  >
            <Maximize2 className="w-4 h-4 text-[#881930]" />
          </button>

          {
    /* Share Button */
  }
          {onShare && <button
    type="button"
    onClick={onShare}
    className="p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 rounded-full shadow-md transition-all cursor-pointer hover:scale-105 border border-stone-200/60"
    title="Share Saree"
  >
              <Share2 className="w-4 h-4" />
            </button>}
        </div>

        {
    /* Floating Hover Instruction Tooltip (Fades out when hovering) */
  }
        {!isHovering && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[11px] font-medium px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 border border-amber-400/40 pointer-events-none transition-opacity duration-200 animate-pulse">
            <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
            <span>Hover to Zoom: Inspect fabric and weaving quality</span>
          </div>}
      </div>

      {
    /* Control Bar: Mode Toggle + Zoom Stepper + Quick Zone Focus */
  }
      <div className="mt-3.5 p-3.5 bg-stone-50/95 border border-stone-200 rounded-2xl space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {
    /* Zoom Mode Selector */
  }
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-[10px] font-bold text-stone-500 uppercase px-1.5">
              Zoom Mode:
            </span>
            <button
    type="button"
    onClick={() => setZoomMode("loupe")}
    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${zoomMode === "loupe" ? "bg-[#881930] text-white shadow-xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
  >
              <Crosshair className="w-3 h-3" />
              <span>Magnifying Loupe</span>
            </button>

            <button
    type="button"
    onClick={() => setZoomMode("inner")}
    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${zoomMode === "inner" ? "bg-[#881930] text-white shadow-xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
  >
              <ZoomIn className="w-3 h-3" />
              <span>Inner Pan</span>
            </button>

            <button
    type="button"
    onClick={() => setZoomMode("side")}
    className={`hidden lg:flex px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer items-center gap-1 ${zoomMode === "side" ? "bg-[#881930] text-white shadow-xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
  >
              <Eye className="w-3 h-3" />
              <span>Side Window</span>
            </button>
          </div>

          {
    /* Zoom Power Multiplier & Weave Texture Mode */
  }
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase mr-1">
                Magnification:
              </span>
              {[2, 3.5, 5, 8].map((lvl) => <button
    key={lvl}
    type="button"
    onClick={() => setZoomLevel(lvl)}
    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${zoomLevel === lvl ? "bg-amber-100 text-amber-900 border border-amber-300" : "text-stone-600 hover:bg-stone-100"}`}
  >
                  {lvl}x
                </button>)}
            </div>

            {
    /* Weave Texture Inspector Toggle */
  }
            <button
    type="button"
    onClick={() => setShowTextureGrid(!showTextureGrid)}
    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${showTextureGrid ? "bg-[#881930] text-amber-200 border-[#881930] shadow-xs" : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"}`}
    title="Toggle micro weave texture grid & thread inspection"
  >
              <Layers className="w-3 h-3 text-amber-400" />
              <span>{showTextureGrid ? "Weave Grid: ON" : "Inspect Weave Texture"}</span>
            </button>
          </div>
        </div>

        {
    /* Weave Texture Info Banner when active */
  }
        {showTextureGrid && <div className="mt-2 p-2 bg-amber-50/90 border border-amber-300/80 rounded-xl text-[11px] text-amber-950 flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Handloom Weave Texture Inspection:</strong> Pure Silk Warp 120 EPI × Weft 96 PPI • Real Metallic Zari
              </span>
            </div>
            <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold shrink-0">
              High-Res Macro
            </span>
          </div>}

        {
    /* Quick Focus Hotspots for Fabric & Weaving Inspection */
  }
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-stone-200/70 gap-2">
          <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#881930]" />
            <span>Quick Handloom Weave & Zari Check:</span>
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
    type="button"
    onClick={() => handleFocusZone("pallu")}
    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${activeHotspot === "pallu" ? "bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs" : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"}`}
  >
              <span>🌟 Pallu Zari</span>
            </button>

            <button
    type="button"
    onClick={() => handleFocusZone("border")}
    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${activeHotspot === "border" ? "bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs" : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"}`}
  >
              <span>✨ Border Motif</span>
            </button>

            <button
    type="button"
    onClick={() => handleFocusZone("weave")}
    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${activeHotspot === "weave" ? "bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs" : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"}`}
  >
              <span>🧵 Silk Weft</span>
            </button>

            <button
    type="button"
    onClick={() => handleFocusZone("zari")}
    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${activeHotspot === "zari" ? "bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs" : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"}`}
  >
              <span>💎 Zari Lustre</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* FULLSCREEN LIGHTBOX MODAL WITH ULTRA-HIGH MAGNIFICATION & PAN (UP TO 8X) */
  }
      {isFullscreen && <div
    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200 select-none"
    onClick={() => setIsFullscreen(false)}
  >
          {
    /* Header */
  }
          <div
    className="p-4 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-white shrink-0"
    onClick={(e) => e.stopPropagation()}
  >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#881930] flex items-center justify-center text-amber-300">
                <ZoomIn className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-100">
                  {alt}
                </h3>
                <p className="text-xs text-amber-400 font-mono">
                  Ultra-High Resolution Saree Weave & Zari Inspector • {fullscreenZoom.toFixed(1)}x Optical Zoom (Up to 8x)
                </p>
              </div>
            </div>

            {
    /* Controls */
  }
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg border border-stone-700">
                <button
    type="button"
    onClick={() => setFullscreenZoom((prev) => Math.max(1, prev - 0.5))}
    className="p-1.5 hover:bg-stone-700 rounded text-stone-300 hover:text-white cursor-pointer"
    title="Zoom Out"
  >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-amber-300 px-2 font-bold min-w-[45px] text-center">
                  {fullscreenZoom.toFixed(1)}x
                </span>
                <button
    type="button"
    onClick={() => setFullscreenZoom((prev) => Math.min(8, prev + 0.5))}
    className="p-1.5 hover:bg-stone-700 rounded text-stone-300 hover:text-white cursor-pointer"
    title="Zoom In"
  >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
    type="button"
    onClick={() => {
      setFullscreenZoom(3);
      setFullscreenPan({ x: 0, y: 0 });
    }}
    className="px-2 py-1 text-[11px] hover:bg-stone-700 rounded text-stone-400 hover:text-white cursor-pointer"
  >
                  Reset
                </button>
              </div>

              <button
    type="button"
    onClick={() => setIsFullscreen(false)}
    className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
  >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {
    /* Interactive Pan Viewport */
  }
          <div
    ref={fullscreenContainerRef}
    onMouseDown={handleFsMouseDown}
    onMouseMove={handleFsMouseMove}
    onMouseUp={handleFsMouseUp}
    onWheel={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setFullscreenZoom(
        (prev) => Math.min(8, Math.max(1, prev + (e.deltaY < 0 ? 0.5 : -0.5)))
      );
    }}
    className="flex-1 overflow-hidden relative flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
    onClick={(e) => e.stopPropagation()}
  >
            <div className="relative">
              <img
    src={effectiveSrc}
    alt={alt}
    referrerPolicy="no-referrer"
    draggable={false}
    className="max-h-[85vh] max-w-[85vw] object-contain transition-transform duration-75 select-none"
    style={{
      transform: `scale(${fullscreenZoom}) translate(${fullscreenPan.x / fullscreenZoom}px, ${fullscreenPan.y / fullscreenZoom}px)`
    }}
  />
              {
    /* Optional Subtle Texture Thread Grid in High-Res Fullscreen */
  }
              {showTextureGrid && <div
    className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
    style={{
      backgroundImage: "radial-gradient(circle, rgba(242,206,110,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
      backgroundSize: "12px 12px, 6px 6px, 6px 6px",
      transform: `scale(${fullscreenZoom}) translate(${fullscreenPan.x / fullscreenZoom}px, ${fullscreenPan.y / fullscreenZoom}px)`
    }}
  />}
            </div>

            {
    /* Instruction Callout & Weave Density Badge */
  }
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <div className="bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-700 text-stone-300 text-xs flex items-center gap-2 pointer-events-none shadow-xl">
                <Move className="w-3.5 h-3.5 text-amber-400" />
                <span>Drag to Pan • Mouse Wheel to Zoom (1x - 8x) • Inspect Weave Details</span>
              </div>
              <button
    type="button"
    onClick={() => setShowTextureGrid(!showTextureGrid)}
    className="bg-stone-800/90 hover:bg-stone-700 text-amber-300 border border-stone-600 px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xl"
  >
                <Layers className="w-3.5 h-3.5" />
                <span>{showTextureGrid ? "Thread Grid: ON" : "Thread Grid: OFF"}</span>
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
