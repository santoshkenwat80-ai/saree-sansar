import { useState } from "react";
import {
  X,
  Ruler,
  Sparkles,
  Check,
  Info,
  Layers,
  Scissors
} from "lucide-react";
const BLOUSE_SIZES = [
  { label: "XS", sizeNumber: 32, bustInches: 32, waistInches: 26, blouseLengthInches: 13.5, shoulderInches: 13.5, armholeInches: 14 },
  { label: "S", sizeNumber: 34, bustInches: 34, waistInches: 28, blouseLengthInches: 14, shoulderInches: 14, armholeInches: 14.5 },
  { label: "M", sizeNumber: 36, bustInches: 36, waistInches: 30, blouseLengthInches: 14.5, shoulderInches: 14.5, armholeInches: 15.5 },
  { label: "L", sizeNumber: 38, bustInches: 38, waistInches: 32, blouseLengthInches: 15, shoulderInches: 15, armholeInches: 16.5 },
  { label: "XL", sizeNumber: 40, bustInches: 40, waistInches: 34, blouseLengthInches: 15.5, shoulderInches: 15.5, armholeInches: 17.5 },
  { label: "2XL", sizeNumber: 42, bustInches: 42, waistInches: 36, blouseLengthInches: 16, shoulderInches: 16, armholeInches: 18.5 },
  { label: "3XL", sizeNumber: 44, bustInches: 44, waistInches: 38, blouseLengthInches: 16.5, shoulderInches: 16.5, armholeInches: 19.5 },
  { label: "4XL", sizeNumber: 46, bustInches: 46, waistInches: 40, blouseLengthInches: 17, shoulderInches: 17, armholeInches: 20.5 }
];
export const SizeGuideModal = ({
  isOpen,
  onClose,
  sareeLength = "5.5 meters saree + 0.8 meter unstitched blouse piece (total 6.3m)",
  blouseDetails = "Matching pure zari unstitched brocade blouse piece included"
}) => {
  const [activeTab, setActiveTab] = useState("blouse");
  const [unit, setUnit] = useState("inches");
  const [userBustInput, setUserBustInput] = useState("36");
  if (!isOpen) return null;
  const toDisplayValue = (inches) => {
    if (unit === "inches") {
      return `${inches}"`;
    }
    return `${Math.round(inches * 2.54)} cm`;
  };
  const numericBust = parseFloat(userBustInput) || 36;
  const closestMatch = BLOUSE_SIZES.reduce((prev, curr) => {
    return Math.abs(curr.bustInches - numericBust) < Math.abs(prev.bustInches - numericBust) ? curr : prev;
  });
  return <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in overflow-y-auto"
    onClick={onClose}
  >
      <div
    className="bg-white border border-[#d4af37]/50 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-stone-900"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header Strip */
  }
        <div className="bg-gradient-to-r from-[#4a0e1b] via-[#5c1223] to-[#4a0e1b] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#881930] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f2ce6e]/20 border border-[#f2ce6e]/40 flex items-center justify-center text-[#f2ce6e] shadow-xs">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#f2ce6e] flex items-center gap-2">
                <span>Royal Size &amp; Measurement Guide</span>
              </h2>
              <p className="text-[11px] text-amber-100/90 font-medium">
                Blouse Tailoring Chart, Saree Drape Lengths &amp; Sizing Assistant
              </p>
            </div>
          </div>

          <button
    type="button"
    onClick={onClose}
    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
    aria-label="Close size guide"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Tab Navigation & Unit Switcher */
  }
        <div className="bg-stone-50 border-b border-stone-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {
    /* Tabs */
  }
          <div className="flex items-center gap-1">
            <button
    type="button"
    onClick={() => setActiveTab("blouse")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "blouse" ? "bg-[#881930] text-white shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"}`}
  >
              Blouse Measurement Chart
            </button>
            <button
    type="button"
    onClick={() => setActiveTab("saree")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "saree" ? "bg-[#881930] text-white shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"}`}
  >
              Saree Dimensions &amp; Drape
            </button>
            <button
    type="button"
    onClick={() => setActiveTab("calculator")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "calculator" ? "bg-[#881930] text-white shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"}`}
  >
              Size Finder
            </button>
          </div>

          {
    /* Unit Switcher (Inches / CM) */
  }
          {activeTab !== "saree" && <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 px-1 uppercase tracking-wider">Unit:</span>
              <button
    type="button"
    onClick={() => setUnit("inches")}
    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${unit === "inches" ? "bg-[#881930] text-white" : "text-stone-600 hover:text-stone-900"}`}
  >
                Inches (")
              </button>
              <button
    type="button"
    onClick={() => setUnit("cm")}
    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${unit === "cm" ? "bg-[#881930] text-white" : "text-stone-600 hover:text-stone-900"}`}
  >
                CM
              </button>
            </div>}
        </div>

        {
    /* Modal Scrollable Body */
  }
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {
    /* TAB 1: Blouse Size Measurement Chart */
  }
          {activeTab === "blouse" && <div className="space-y-6">
              {
    /* Highlight callout */
  }
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">Tailoring Note from Saree Sansar Guild:</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Our authentic sarees include an unstitched blouse piece (0.8m to 1.0m cut) with up to 4 inches of interior seam margin. You can tailor any size from XS (32) up to 4XL (46) with comfortable neckline cuts.
                  </p>
                </div>
              </div>

              {
    /* Responsive Size Table */
  }
              <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FCF9F5] text-stone-700 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Standard Size</th>
                      <th className="py-3 px-3">Bust Size</th>
                      <th className="py-3 px-3">Underbust / Waist</th>
                      <th className="py-3 px-3">Blouse Length</th>
                      <th className="py-3 px-3">Shoulder</th>
                      <th className="py-3 px-3">Armhole</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {BLOUSE_SIZES.map((row) => <tr
    key={row.label}
    className="hover:bg-amber-50/40 transition-colors even:bg-stone-50/40"
  >
                        <td className="py-2.5 px-3.5 font-sans font-bold text-stone-900 flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-md bg-[#881930]/10 text-[#881930] flex items-center justify-center text-[10px] font-bold font-mono">
                            {row.label}
                          </span>
                          <span>Size {row.sizeNumber}</span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {toDisplayValue(row.bustInches)}
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">
                          {toDisplayValue(row.waistInches)}
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">
                          {toDisplayValue(row.blouseLengthInches)}
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">
                          {toDisplayValue(row.shoulderInches)}
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">
                          {toDisplayValue(row.armholeInches)}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>

              {
    /* How to Measure Step-by-Step Instructions */
  }
              <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#881930] flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-[#881930]" />
                  <span>How to Take Perfect Blouse Measurements</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="p-3 bg-white rounded-lg border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 block">1. Bust Circumference</span>
                    <p className="text-[11px] leading-relaxed">
                      Measure around the fullest part of your chest keeping the measuring tape parallel to the floor, over your intended fitting bra.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 block">2. Underbust / Waistline</span>
                    <p className="text-[11px] leading-relaxed">
                      Wrap the tape snugly right below the bust where the bottom band of your blouse will comfortably sit.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 block">3. Blouse Length</span>
                    <p className="text-[11px] leading-relaxed">
                      Measure vertically from the high point of your shoulder down to your preferred crop line (typically 14" to 15.5").
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80 space-y-1">
                    <span className="font-bold text-stone-900 block">4. Armhole &amp; Sleeve</span>
                    <p className="text-[11px] leading-relaxed">
                      Pass tape comfortably under the armpit and over the shoulder bone. Leave half an inch ease for free arm movement.
                    </p>
                  </div>
                </div>
              </div>
            </div>}

          {
    /* TAB 2: Saree Dimensions & Drape Length Guide */
  }
          {activeTab === "saree" && <div className="space-y-6">
              {
    /* Saree Metric Stats Box */
  }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Total Saree Length
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#881930] block mt-1 font-mono">
                    6.3 Meters
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    5.5m Saree + 0.8m Blouse
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Saree Width (Pana)
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#881930] block mt-1 font-mono">
                    44 to 47 Inches
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    112 to 120 cm standard fall height
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Blouse Fabric Cut
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#881930] block mt-1 font-mono">
                    80 to 100 CM
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Unstitched with heavy zari border
                  </span>
                </div>
              </div>

              {
    /* Saree Drape Guide by Height & Body Type */
  }
              <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#881930] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#881930]" />
                  <span>Drape &amp; Pleating Guide by Height</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                      <span>Petite Frame (Height below 5'2")</span>
                      <span className="text-[10px] text-[#881930] bg-rose-50 px-2 py-0.5 rounded font-mono">
                        5 Pleats · 1.2m Pallu
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Make 5 clean pleats of 4-inch width. Pin the pallu slightly higher on the shoulder to elongate your silhouette and keep the border sweeping the footwear.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                      <span>Regular Frame (Height 5'2" to 5'8")</span>
                      <span className="text-[10px] text-[#881930] bg-rose-50 px-2 py-0.5 rounded font-mono">
                        6 to 7 Pleats · 1.0m Pallu
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Standard Nivi drape is effortlessly flattering. Fold 6 to 7 pleats tucked right below the navel with a cascading shoulder drape.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                      <span>Tall Frame (Height above 5'8")</span>
                      <span className="text-[10px] text-[#881930] bg-rose-50 px-2 py-0.5 rounded font-mono">
                        5 to 6 Wide Pleats · Floor-Touch
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Wider pleats (5 to 6 inches) ensure maximum floor-touch coverage. Handloom Katan and Kanjivaram drapes hold magnificent structure for tall statures.
                    </p>
                  </div>
                </div>
              </div>

              {
    /* Current Saree Specs Info */
  }
              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-1">
                <span className="font-bold text-[#881930] block">Included with this Saree:</span>
                <p className="text-stone-700">{sareeLength}</p>
                <p className="text-stone-500 text-[11px]">{blouseDetails}</p>
              </div>
            </div>}

          {
    /* TAB 3: Smart Size Finder Calculator */
  }
          {activeTab === "calculator" && <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 rounded-xl border border-amber-300 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#881930] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Instant Blouse Size Recommender</span>
                  </h4>
                  <p className="text-xs text-stone-600">
                    Enter your bust measurement in inches to see your tailored size recommendation.
                  </p>
                </div>

                {
    /* Input Controls */
  }
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-stone-700 shrink-0">
                    Your Bust Size:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
    type="number"
    min={28}
    max={52}
    value={userBustInput}
    onChange={(e) => setUserBustInput(e.target.value)}
    className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#881930]/30 focus:border-[#881930]"
  />
                    <span className="text-xs font-bold text-stone-500">Inches (")</span>
                  </div>
                </div>

                {
    /* Recommendation Result Card */
  }
                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Recommended Blouse Size
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-serif text-3xl font-bold text-[#881930]">
                          {closestMatch.label}
                        </span>
                        <span className="text-sm font-bold text-stone-700 font-mono">
                          (Size {closestMatch.sizeNumber})
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Flawless Fit</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 bg-stone-50 rounded">
                      <span className="text-[10px] text-stone-400 block font-sans">Bust</span>
                      <span className="font-bold text-stone-800">{closestMatch.bustInches}"</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded">
                      <span className="text-[10px] text-stone-400 block font-sans">Waist</span>
                      <span className="font-bold text-stone-800">{closestMatch.waistInches}"</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded">
                      <span className="text-[10px] text-stone-400 block font-sans">Length</span>
                      <span className="font-bold text-stone-800">{closestMatch.blouseLengthInches}"</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded">
                      <span className="text-[10px] text-stone-400 block font-sans">Shoulder</span>
                      <span className="font-bold text-stone-800">{closestMatch.shoulderInches}"</span>
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Free Tailoring Consultation note */
  }
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 block">Need custom blouse tailoring advice?</span>
                  <span className="text-[11px] text-stone-500">
                    Connect with our master tailor via WhatsApp for custom necklines and sleeve fittings.
                  </span>
                </div>
                <a
    href={`https://wa.me/919425505875?text=${encodeURIComponent(
      `Hello Saree Sansar tailor desk! I need blouse stitching guidance for bust size ${userBustInput} inches.`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-3 py-1.5 bg-[#881930] hover:bg-[#6b1426] text-white rounded-lg text-xs font-bold transition-colors shrink-0 ml-3"
  >
                  Tailor Chat
                </a>
              </div>
            </div>}

        </div>

        {
    /* Footer Action */
  }
        <div className="bg-stone-50 px-5 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500">
            Silk Mark Certified Pure Natural Handloom Silk
          </span>
          <button
    type="button"
    onClick={onClose}
    className="px-5 py-2 bg-[#881930] hover:bg-[#6b1426] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
  >
            Got It
          </button>
        </div>
      </div>
    </div>;
};
export default SizeGuideModal;
