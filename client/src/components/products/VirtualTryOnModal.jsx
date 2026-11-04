import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  X,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Move,
  Download,
  RefreshCw,
  Sun,
  Flame,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { formatINR } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { Button } from "../common/Button";
import heroBridalImg from "../../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import toast from "react-hot-toast";
export const VirtualTryOnModal = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();
  const [cameraState, setCameraState] = useState("loading");
  const [cameraFacing, setCameraFacing] = useState("user");
  const [mediaStream, setMediaStream] = useState(null);
  const [useModelPhoto, setUseModelPhoto] = useState(false);
  const [uploadedUserImage, setUploadedUserImage] = useState(null);
  const [drapeStyle, setDrapeStyle] = useState("nivi");
  const [scale, setScale] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.92);
  const [lighting, setLighting] = useState("natural");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const fileInputRef = useRef(null);
  const sareeImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image || heroBridalImg;
  const startCamera = useCallback(async () => {
    setCameraState("loading");
    setUseModelPhoto(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState("unsupported");
        setUseModelPhoto(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {
        });
      }
      setCameraState("active");
    } catch (err) {
      console.warn("Camera access issue:", err);
      setCameraState("denied");
      setUseModelPhoto(true);
    }
  }, [cameraFacing, mediaStream]);
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [mediaStream]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      startCamera();
    } else {
      document.body.style.overflow = "unset";
      stopCamera();
      setSnapshotUrl(null);
    }
    return () => {
      document.body.style.overflow = "unset";
      stopCamera();
    };
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosX(e.clientX - dragStart.x);
    setPosY(e.clientY - dragStart.y);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - posX, y: e.touches[0].clientY - posY });
  };
  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length === 0) return;
    setPosX(e.touches[0].clientX - dragStart.x);
    setPosY(e.touches[0].clientY - dragStart.y);
  };
  const handleTouchEnd = () => setIsDragging(false);
  const handleResetAlignment = () => {
    setScale(1);
    setPosX(0);
    setPosY(0);
    setRotation(0);
    setOpacity(0.92);
    toast.success("Drape position centered", { icon: "\u{1F3AF}" });
  };
  const handleUserPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedUserImage(reader.result);
        setUseModelPhoto(true);
        stopCamera();
        toast.success("Your photo has been loaded! Adjust the drape now.");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 960;
    canvas.height = 1280;
    if (!useModelPhoto && video && cameraState === "active") {
      ctx.save();
      if (cameraFacing === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.fillStyle = "#f8f5f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (uploadedUserImage) {
        const img = new Image();
        img.src = uploadedUserImage;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
    if (lighting === "golden") {
      ctx.fillStyle = "rgba(255, 190, 80, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (lighting === "candlelight") {
      ctx.fillStyle = "rgba(230, 110, 50, 0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const sareeImg = new Image();
    sareeImg.crossOrigin = "anonymous";
    sareeImg.src = sareeImage;
    sareeImg.onload = () => {
      ctx.save();
      ctx.globalAlpha = opacity;
      const cx = canvas.width / 2 + posX * 1.5;
      const cy = canvas.height / 2 + posY * 1.5 + 40;
      ctx.translate(cx, cy);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.scale(scale * 1.4, scale * 1.4);
      const dw = 420;
      const dh = 560;
      ctx.drawImage(sareeImg, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "rgba(107, 20, 38, 0.88)";
      ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
      ctx.fillStyle = "#f2ce6e";
      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.fillText("Saree Sansar \xB7 Royal Virtual Try-On", 30, canvas.height - 45);
      ctx.fillStyle = "#ffffff";
      ctx.font = '16px "Cinzel", sans-serif';
      ctx.fillText(`${product.name} \xB7 ${formatINR(product.price)}`, 30, canvas.height - 20);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("\u2713 100% Silk Mark Authenticated", canvas.width - 280, canvas.height - 35);
      ctx.restore();
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setSnapshotUrl(dataUrl);
      toast.success("Look captured successfully!", { icon: "\u{1F4F8}" });
    };
    if (sareeImg.complete) {
      sareeImg.onload?.(new Event("load"));
    }
  };
  const handleDownloadSnapshot = () => {
    if (!snapshotUrl) return;
    const a = document.createElement("a");
    a.href = snapshotUrl;
    a.download = `SareeSansar-TryOn-${product.slug}-${Date.now()}.jpg`;
    a.click();
    toast.success("Saree look photo downloaded!");
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {
    /* Hidden Offscreen Canvas for Snapshots */
  }
      <canvas ref={canvasRef} className="hidden" />

      {
    /* Main Modal Card */
  }
      <div
    className="relative w-full max-w-5xl bg-stone-900 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-in text-white"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* 1. Modal Top Bar */
  }
        <div className="px-5 py-3.5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#881930] to-[#520f1d] flex items-center justify-center text-amber-300 shadow-sm border border-amber-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Virtual Saree Drape Studio (Interactive Camera Drape)
                </span>
                <span className="text-[10px] bg-emerald-950 border border-emerald-700/60 text-emerald-300 px-2 py-0.2 rounded font-mono">
                  Live AR
                </span>
              </div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-stone-100 truncate max-w-sm sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {
    /* Camera Switch (if live camera active) */
  }
            {!useModelPhoto && cameraState === "active" && <button
    type="button"
    onClick={() => setCameraFacing((prev) => prev === "user" ? "environment" : "user")}
    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700 text-xs flex items-center gap-1.5"
    title="Flip Camera"
  >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip</span>
              </button>}

            <button
    type="button"
    onClick={onClose}
    className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
    aria-label="Close"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* 2. Main Try-On Viewport + Interactive Overlay (Left 8 Cols / Top) */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {
    /* Main Visual Screen: Video or Model (8 cols) */
  }
          <div className="lg:col-span-8 bg-black relative min-h-[420px] sm:min-h-[520px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-stone-800 select-none">
            {
    /* Viewport Frame */
  }
            <div
    ref={viewportRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    className="relative w-full h-full min-h-[420px] sm:min-h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
  >
              {
    /* VIDEO STREAM (Live Camera) */
  }
              {!useModelPhoto && <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className={`w-full h-full object-cover pointer-events-none transition-all duration-300 ${cameraFacing === "user" ? "scale-x-[-1]" : ""}`}
    style={{
      filter: lighting === "golden" ? "sepia(0.18) saturate(1.2) brightness(1.05)" : lighting === "candlelight" ? "sepia(0.3) saturate(1.3) contrast(1.1) brightness(0.98)" : "none"
    }}
  />}

              {
    /* UPLOADED PHOTO OR STUDIO SILHOUETTE FALLBACK */
  }
              {useModelPhoto && <div
    className="w-full h-full min-h-[420px] sm:min-h-[520px] bg-stone-900 flex items-center justify-center relative"
    style={{
      filter: lighting === "golden" ? "sepia(0.18) saturate(1.2) brightness(1.05)" : lighting === "candlelight" ? "sepia(0.3) saturate(1.3) contrast(1.1) brightness(0.98)" : "none"
    }}
  >
                  {uploadedUserImage ? <img
    src={uploadedUserImage}
    alt="User Portrait"
    className="w-full h-full object-contain pointer-events-none"
  /> : (
    /* Default Studio Silhouette / Dress Form */
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950">
                      {
      /* Stylized Indian Bride Silhouette */
    }
                      <svg
      viewBox="0 0 200 400"
      className="w-48 sm:w-64 h-auto opacity-35 text-amber-200 stroke-current fill-none stroke-[1.2]"
    >
                        {
      /* Head & Neck */
    }
                        <circle cx="100" cy="50" r="24" />
                        <path d="M 90 74 Q 100 86 110 74" />
                        {
      /* Shoulders & Torso */
    }
                        <path d="M 60 100 Q 100 85 140 100 L 148 150 Q 100 160 52 150 Z" />
                        {
      /* Waist & Hips */
    }
                        <path d="M 68 150 Q 100 156 132 150 L 142 220 Q 100 230 58 220 Z" />
                        {
      /* Skirt / Gher */
    }
                        <path d="M 58 220 L 40 380 Q 100 395 160 380 L 142 220 Z" />
                      </svg>
                      <p className="text-xs text-stone-400 mt-3 font-medium">
                        Studio Mannequin Mode
                      </p>
                    </div>
  )}
                </div>}

              {
    /* CAMERA PERMISSION / ERROR FALLBACK OVERLAY */
  }
              {cameraState === "denied" && !uploadedUserImage && <div className="absolute top-4 inset-x-4 p-3 bg-amber-950/90 border border-amber-600/60 rounded-2xl text-xs text-amber-200 flex items-center justify-between gap-3 backdrop-blur-md z-30">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Camera permission is unavailable. You can upload a photo below or select a studio model.</span>
                  </div>
                  <button
    type="button"
    onClick={startCamera}
    className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded text-[11px] font-semibold shrink-0 cursor-pointer"
  >
                    Try Again
                  </button>
                </div>}

              {
    /* ======================================================== */
  }
              {
    /* 2D SAREE DRAPE OVERLAY (AUTHENTIC DRAPING GEOMETRY)     */
  }
              {
    /* ======================================================== */
  }
              <div
    className="absolute pointer-events-auto cursor-move transition-transform duration-75"
    style={{
      transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`,
      opacity,
      transformOrigin: "center center"
    }}
  >
                {
    /* DRAPE STYLE 1: CLASSIC NIVI DRAPE (Left Shoulder Diagonal) */
  }
                {drapeStyle === "nivi" && <div className="relative w-[340px] sm:w-[420px] h-[480px] sm:h-[580px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {
    /* Waist Pleats & Gher Texture */
  }
                    <div
    className="absolute bottom-0 inset-x-8 h-[280px] sm:h-[340px] rounded-b-3xl overflow-hidden border-b-4 border-amber-400 shadow-xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "160% auto",
      backgroundPosition: "center bottom",
      clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)"
    }}
  >
                      {
    /* Vertical pleat fold shadows */
  }
                      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent via-black/25 via-transparent to-black/35 pointer-events-none" />
                      {
    /* Bottom Zari Border Accent */
  }
                      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-amber-400/50 via-amber-200/30 to-transparent border-t border-amber-300/40" />
                    </div>

                    {
    /* Diagonal Pallu Crossing Chest to Left Shoulder */
  }
                    <div
    className="absolute top-2 left-6 w-[220px] sm:w-[280px] h-[340px] sm:h-[400px] rounded-t-3xl overflow-hidden border-t-2 border-l-2 border-amber-300 shadow-2xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "180% auto",
      backgroundPosition: "top right",
      clipPath: "polygon(10% 0%, 90% 12%, 100% 90%, 0% 100%)",
      transform: "rotate(-16deg)"
    }}
  >
                      {
    /* Pallu Fall Gradient */
  }
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/40 pointer-events-none" />
                      {
    /* Shoulder Pleat Edge */
  }
                      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-amber-400/40 to-transparent" />
                    </div>

                    {
    /* Waist Pleats Knot (Navel gather) */
  }
                    <div className="absolute top-[210px] sm:top-[260px] left-1/2 -translate-x-1/2 w-16 h-8 bg-amber-400/80 rounded-full blur-[1px] opacity-80 border border-amber-200 shadow-md" />
                  </div>}

                {
    /* DRAPE STYLE 2: SEEDHA PALLU / GUJARATI (Right Shoulder Front Spread) */
  }
                {drapeStyle === "seedha" && <div className="relative w-[340px] sm:w-[420px] h-[480px] sm:h-[580px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {
    /* Lower Pleats */
  }
                    <div
    className="absolute bottom-0 inset-x-6 h-[260px] sm:h-[320px] rounded-b-3xl overflow-hidden border-b-4 border-amber-400 shadow-xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "150% auto",
      backgroundPosition: "center bottom",
      clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
    }}
  >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
                    </div>

                    {
    /* Front Fan Pallu flowing from Right Shoulder */
  }
                    <div
    className="absolute top-4 right-4 w-[250px] sm:w-[320px] h-[360px] sm:h-[430px] rounded-2xl overflow-hidden border-t-3 border-r-3 border-amber-300 shadow-2xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "150% auto",
      backgroundPosition: "center top",
      clipPath: "polygon(15% 0%, 100% 0%, 90% 100%, 0% 85%)",
      transform: "rotate(12deg)"
    }}
  >
                      {
    /* Rich Zari Border Display */
  }
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-300/30 via-transparent to-black/35 pointer-events-none" />
                      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-amber-400/50 via-amber-200/20 to-transparent border-t border-amber-300/60" />
                    </div>
                  </div>}

                {
    /* DRAPE STYLE 3: ROYAL BENGALI DRAPE */
  }
                {drapeStyle === "bengali" && <div className="relative w-[340px] sm:w-[420px] h-[480px] sm:h-[580px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {
    /* Broad Bengali Box Pleats */
  }
                    <div
    className="absolute bottom-0 inset-x-4 h-[290px] sm:h-[350px] rounded-b-3xl overflow-hidden border-b-4 border-amber-400 shadow-xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "150% auto",
      backgroundPosition: "center bottom",
      clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"
    }}
  >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent via-black/20 to-black/40 pointer-events-none" />
                    </div>

                    {
    /* Left to Right Wrapped Pallu */
  }
                    <div
    className="absolute top-6 inset-x-8 h-[310px] sm:h-[370px] rounded-3xl overflow-hidden border-2 border-amber-300 shadow-2xl"
    style={{
      backgroundImage: `url(${sareeImage})`,
      backgroundSize: "170% auto",
      backgroundPosition: "top center",
      clipPath: "polygon(0% 10%, 100% 0%, 85% 95%, 15% 100%)"
    }}
  >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/35 pointer-events-none" />
                    </div>
                  </div>}
              </div>

              {
    /* Drag Alignment Hint */
  }
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-700 text-stone-300 text-[11px] flex items-center gap-2 pointer-events-none shadow-lg">
                <Move className="w-3.5 h-3.5 text-amber-400" />
                <span>Drag across the screen to align the saree drape to your shoulders</span>
              </div>
            </div>
          </div>

          {
    /* Right: Controls & Drape Customization (4 cols) */
  }
          <div className="lg:col-span-4 p-5 sm:p-6 bg-stone-900 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div className="space-y-5">
              {
    /* Camera / Photo Source Switcher */
  }
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Input Source (Camera &amp; Model Mode)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
    type="button"
    onClick={() => {
      setUseModelPhoto(false);
      setUploadedUserImage(null);
      startCamera();
    }}
    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${!useModelPhoto ? "bg-[#881930] text-white border-amber-400 font-bold shadow-xs" : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"}`}
  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Live Camera</span>
                  </button>

                  <button
    type="button"
    onClick={() => {
      setUseModelPhoto(true);
      stopCamera();
    }}
    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${useModelPhoto && !uploadedUserImage ? "bg-[#881930] text-white border-amber-400 font-bold shadow-xs" : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"}`}
  >
                    <User className="w-3.5 h-3.5" />
                    <span>Studio Model</span>
                  </button>
                </div>

                {
    /* Upload own photo trigger */
  }
                <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Or use your own portrait:</span>
                  <input
    type="file"
    ref={fileInputRef}
    accept="image/*"
    onChange={handleUserPhotoUpload}
    className="hidden"
  />
                  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="text-amber-400 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
  >
                    + Upload Photo
                  </button>
                </div>
              </div>

              {
    /* Drape Style Selection */
  }
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Saree Drape Style
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
    { id: "nivi", label: "Nivi Drape", subtitle: "Classic Shoulder" },
    { id: "seedha", label: "Seedha Pallu", subtitle: "Gujarati Front" },
    { id: "bengali", label: "Bengali Drape", subtitle: "Royal Pleats" }
  ].map((style) => <button
    key={style.id}
    type="button"
    onClick={() => setDrapeStyle(style.id)}
    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${drapeStyle === style.id ? "bg-[#881930] text-white border-amber-400 font-bold shadow-xs" : "bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500"}`}
  >
                      <span className="block font-semibold">{style.label}</span>
                      <span className="text-[10px] text-stone-400">{style.subtitle}</span>
                    </button>)}
                </div>
              </div>

              {
    /* Lighting Atmosphere Selector */
  }
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Lighting &amp; Ambience
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
    { id: "natural", label: "Daylight", icon: Sun },
    { id: "golden", label: "Golden Hour", icon: Sparkles },
    { id: "candlelight", label: "Festive Glow", icon: Flame }
  ].map((lit) => {
    const Icon = lit.icon;
    return <button
      key={lit.id}
      type="button"
      onClick={() => setLighting(lit.id)}
      className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${lighting === lit.id ? "bg-amber-950 border-amber-400 text-amber-200 font-bold shadow-2xs" : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"}`}
    >
                        <Icon className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px]">{lit.label}</span>
                      </button>;
  })}
                </div>
              </div>

              {
    /* Saree Fit & Fine-Tuning Sliders */
  }
              <div className="p-3.5 bg-stone-850 rounded-2xl border border-stone-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200">Size &amp; Alignment</span>
                  <button
    type="button"
    onClick={handleResetAlignment}
    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {
    /* Scale Slider */
  }
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>Saree Scale</span>
                    <span className="font-mono text-amber-300">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
    type="range"
    min="0.7"
    max="1.5"
    step="0.05"
    value={scale}
    onChange={(e) => setScale(parseFloat(e.target.value))}
    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
  />
                </div>

                {
    /* Opacity Slider */
  }
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>Drape Transparency</span>
                    <span className="font-mono text-amber-300">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
    type="range"
    min="0.5"
    max="1.0"
    step="0.02"
    value={opacity}
    onChange={(e) => setOpacity(parseFloat(e.target.value))}
    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
  />
                </div>
              </div>

              {
    /* Action Buttons: Snapshot & Add to Bag */
  }
              <div className="space-y-2.5 pt-1">
                <Button
    type="button"
    onClick={handleCaptureSnapshot}
    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 shadow-md flex items-center justify-center gap-2"
  >
                  <Camera className="w-4 h-4 text-white" />
                  <span>Capture Saree Look</span>
                </Button>

                <Button
    type="button"
    onClick={() => {
      addToCart(product, 1);
      toast.success("Saree added to your shopping bag!", { icon: "\u{1F6CD}\uFE0F" });
      onClose();
    }}
    className="w-full bg-[#881930] hover:bg-[#6b1426] text-white font-bold py-2.5 shadow-md flex items-center justify-center gap-2"
  >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Saree to Bag ({formatINR(product.price)})</span>
                </Button>
              </div>
            </div>

            {
    /* Authenticity Guarantee Footer */
  }
            <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Silk Mark Authenticated</span>
              </span>
              <span>Authentic Handloom Weave</span>
            </div>
          </div>
        </div>

        {
    /* 3. CAPTURED SNAPSHOT PREVIEW MODAL */
  }
        {snapshotUrl && <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-scale-in">
            <div className="max-w-md w-full bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 text-center">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif text-base font-bold text-stone-100">
                    Your Virtual Saree Look
                  </h3>
                </div>
                <button
    type="button"
    onClick={() => setSnapshotUrl(null)}
    className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
  >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-stone-700 aspect-3/4 max-h-[50vh] mx-auto bg-stone-950">
                <img
    src={snapshotUrl}
    alt="Virtual Try On Look"
    className="w-full h-full object-contain"
  />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
    type="button"
    onClick={() => setSnapshotUrl(null)}
    variant="outline"
    size="sm"
    className="border-stone-700 text-stone-300 hover:bg-stone-800"
  >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Retake Photo</span>
                </Button>

                <Button
    type="button"
    onClick={handleDownloadSnapshot}
    size="sm"
    className="bg-emerald-700 hover:bg-emerald-800 text-white"
  >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download Photo</span>
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
