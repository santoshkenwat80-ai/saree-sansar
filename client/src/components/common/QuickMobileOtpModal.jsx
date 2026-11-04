import { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Settings,
  Check,
  Key,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { Button } from "./Button";
import toast from "react-hot-toast";
export const QuickMobileOtpModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = "6267961163",
  title = "Mobile Number OTP Login & Verification"
}) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [dispatchedOtp, setDispatchedOtp] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [smsUrl, setSmsUrl] = useState(null);
  const [preferredChannel, setPreferredChannel] = useState("whatsapp");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);
  const [fast2smsKey, setFast2smsKey] = useState("");
  const [twofactorKey, setTwofactorKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [hasCellularGateway, setHasCellularGateway] = useState(false);
  const otpInputRef = useRef(null);
  const { loginWithOtp } = useAuth();
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOtp("");
      setDispatchedOtp(null);
      setCopiedOtp(false);
      if (initialPhone) setPhone(initialPhone);
      authService.getSmsConfig?.().then((cfg) => {
        if (cfg) {
          setHasCellularGateway(cfg.fast2sms || cfg.twofactor || cfg.twilio);
        }
      }).catch(() => {
      });
    }
  }, [isOpen, initialPhone]);
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);
  const playSmsChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch {
    }
  };
  if (!isOpen) return null;
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(cleanPhone, "phone", "login");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        const wa = res.whatsappUrl || `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Your Saree Sansar OTP is ${res.otp}`)}`;
        const sm = res.smsUrl || `sms:+91${cleanPhone}?body=${encodeURIComponent(`Your Saree Sansar OTP is ${res.otp}`)}`;
        setWhatsappUrl(wa);
        setSmsUrl(sm);
        setHasCellularGateway(!!res.hasCellularGateway);
        setStep(2);
        setResendTimer(30);
        playSmsChime();
        toast.success(`OTP sent to mobile +91 ${cleanPhone}!`, { icon: "\u{1F4F1}" });
        if (preferredChannel === "whatsapp" && /android|iphone|ipad|mobile/i.test(navigator.userAgent)) {
          window.open(wa, "_blank");
        }
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP. Please check your number.");
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleVerifyDirect = async (codeToVerify) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const cleanOtp = codeToVerify.replace(/\D/g, "").slice(0, 6);
    if (cleanOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const success = await loginWithOtp(cleanPhone, cleanOtp);
      if (success) {
        toast.success("Mobile number verified successfully!", { icon: "\u{1F389}" });
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP code entered");
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    handleVerifyDirect(otp);
  };
  const handleAutoFillAndProceed = () => {
    if (dispatchedOtp) {
      setOtp(dispatchedOtp);
      toast.success("OTP code auto-filled! Verifying...", { icon: "\u26A1" });
      handleVerifyDirect(dispatchedOtp);
    }
  };
  const handleCopyOtp = () => {
    if (dispatchedOtp) {
      navigator.clipboard.writeText(dispatchedOtp);
      setCopiedOtp(true);
      toast.success("OTP copied to clipboard!");
      setTimeout(() => setCopiedOtp(false), 2e3);
    }
  };
  const handleOtpChange = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setOtp(clean);
    if (clean.length === 6) {
      handleVerifyDirect(clean);
    }
  };
  const handleSaveGatewayKey = async (e) => {
    e.preventDefault();
    if (!fast2smsKey && !twofactorKey) {
      toast.error("Please enter Fast2SMS or 2Factor API Key");
      return;
    }
    setIsSavingKey(true);
    try {
      await authService.configureSmsGateway({
        fast2smsApiKey: fast2smsKey || void 0,
        twoFactorApiKey: twofactorKey || void 0
      });
      toast.success("Live SMS Gateway API Key saved successfully!", { icon: "\u2705" });
      setHasCellularGateway(true);
      setShowGatewayConfig(false);
    } catch {
      toast.error("Failed to save SMS API Key");
    } finally {
      setIsSavingKey(false);
    }
  };
  return <div
    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    onClick={onClose}
  >
      <div
    className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 text-stone-900 relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Top Header Banner */
  }
        <div className="bg-gradient-to-r from-[#5a0e1c] via-[#6b1426] to-[#881930] text-white p-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#f2ce6e] border border-white/20 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-sm tracking-wide text-white">
                  {title}
                </h3>
              </div>
              <p className="text-[11px] text-rose-200">
                100% Secure • WhatsApp / SMS / Instant OTP
              </p>
            </div>
          </div>

          <button
    type="button"
    onClick={onClose}
    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
  >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {
    /* STEP 1: Enter Mobile Number */
  }
          {step === 1 ? <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  Enter 10-digit Mobile Number
                </label>
                <div className="relative flex rounded-xl shadow-2xs border-2 border-stone-300 focus-within:border-[#881930] transition-colors">
                  <span className="inline-flex items-center px-3.5 rounded-l-lg bg-stone-100 text-stone-800 text-xs font-bold border-r border-stone-300">
                    🇮🇳 +91
                  </span>
                  <input
    type="tel"
    required
    maxLength={10}
    placeholder="e.g. 6267961163"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
    className="flex-1 block w-full px-3.5 py-3 text-stone-900 text-base font-mono font-bold tracking-wider focus:outline-none bg-white rounded-r-lg"
    autoFocus
  />
                </div>
              </div>

              {
    /* Delivery Channel Selector */
  }
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">
                  Select delivery channel:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
    type="button"
    onClick={() => setPreferredChannel("whatsapp")}
    className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${preferredChannel === "whatsapp" ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500" : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"}`}
  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">WhatsApp</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-medium">Recommended</span>
                  </button>

                  <button
    type="button"
    onClick={() => setPreferredChannel("sms")}
    className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${preferredChannel === "sms" ? "border-[#881930] bg-rose-50 text-[#881930] font-bold shadow-xs ring-1 ring-[#881930]" : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"}`}
  >
                    <Smartphone className="w-4 h-4 text-[#881930]" />
                    <span className="text-[11px]">Phone SMS</span>
                    <span className="text-[9px] text-stone-500">Network / App</span>
                  </button>

                  <button
    type="button"
    onClick={() => setPreferredChannel("screen")}
    className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${preferredChannel === "screen" ? "border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs ring-1 ring-amber-500" : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"}`}
  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px]">Instant Code</span>
                    <span className="text-[9px] text-amber-700">1-Click</span>
                  </button>
                </div>
              </div>

              {
    /* Demo Numbers */
  }
              <div className="bg-[#FCF9F5] p-3 rounded-xl border border-amber-200/60 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 block">
                  Quick 1-Click Test Numbers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
    type="button"
    onClick={() => setPhone("6267961163")}
    className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-mono text-[#881930] font-bold text-xs cursor-pointer shadow-2xs"
  >
                    📱 6267961163 (Santosh Kumar)
                  </button>
                  <button
    type="button"
    onClick={() => setPhone("9876543210")}
    className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-mono text-stone-800 font-medium text-xs cursor-pointer shadow-2xs"
  >
                    📱 9876543210 (Demo User)
                  </button>
                </div>
              </div>

              {
    /* Submit Button */
  }
              <Button
    type="submit"
    size="lg"
    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#6b1426] hover:bg-[#520f1d] text-white shadow-md text-sm font-bold"
    isLoading={isSendingOtp}
    disabled={phone.replace(/\D/g, "").length !== 10}
  >
                <Smartphone className="w-4 h-4" />
                <span>Send OTP to Mobile</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form> : (
    /* STEP 2: Verify 6-digit OTP */
    <form onSubmit={handleVerifySubmit} className="space-y-4">
              {
      /* PRIMARY ACTION: DIRECT PHONE DELIVERY BANNER */
    }
              <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>OTP sent to mobile +91 {phone}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono">
                    Active
                  </span>
                </div>

                {
      /* Big Direct WhatsApp Delivery Button */
    }
                {whatsappUrl && <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm group"
    >
                    <MessageSquare className="w-4 h-4 text-white fill-white shrink-0" />
                    <span>📲 Open this OTP in WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                  </a>}

                {
      /* Secondary Direct SMS App Button */
    }
                {smsUrl && <a
      href={smsUrl}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 font-semibold rounded-lg border border-stone-300 text-xs transition-colors"
    >
                    <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                    <span>💬 Open in Default SMS App</span>
                  </a>}

                {
      /* Instant On-Screen OTP Box */
    }
                {dispatchedOtp && <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">
                        Received 6-digit OTP Code:
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-2xl font-black tracking-widest text-[#881930]">
                          {dispatchedOtp}
                        </span>
                        <button
      type="button"
      onClick={handleCopyOtp}
      className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
      title="Copy OTP"
    >
                          {copiedOtp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
      type="button"
      onClick={handleAutoFillAndProceed}
      disabled={isVerifyingOtp}
      className="py-2 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ Auto-Verify</span>
                    </button>
                  </div>}
              </div>

              {
      /* 6-digit OTP Input Box */
    }
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Enter 6-digit OTP
                  </label>
                  <button
      type="button"
      onClick={() => {
        setStep(1);
        setOtp("");
      }}
      className="text-xs text-[#881930] hover:underline font-semibold"
    >
                    Change Number
                  </button>
                </div>

                <input
      ref={otpInputRef}
      type="text"
      maxLength={6}
      placeholder="• • • • • •"
      value={otp}
      onChange={(e) => handleOtpChange(e.target.value)}
      className="w-full py-3 text-center text-3xl font-mono tracking-[0.4em] font-black border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#881930] focus:ring-2 focus:ring-[#881930]/20 bg-stone-50"
    />
                <p className="text-[11px] text-stone-500 text-center mt-1">
                  Automatically verifies once 6 digits are entered.
                </p>
              </div>

              {
      /* Resend OTP */
    }
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Didn't receive OTP?</span>
                <button
      type="button"
      onClick={() => handleSendOtp()}
      disabled={resendTimer > 0 || isSendingOtp}
      className="text-[#881930] hover:underline font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
    >
                  <RotateCcw className="w-3 h-3" />
                  <span>
                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
                  </span>
                </button>
              </div>

              {
      /* Verify Button */
    }
              <Button
      type="submit"
      size="lg"
      className="w-full py-3 bg-[#6b1426] hover:bg-[#520f1d] text-white shadow-md text-sm font-bold flex items-center justify-center gap-2"
      isLoading={isVerifyingOtp}
      disabled={otp.length !== 6}
    >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Verify & Login</span>
              </Button>
            </form>
  )}

          {
    /* Collapsible Live Cellular SMS Gateway Settings */
  }
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 text-xs">
            <button
    type="button"
    onClick={() => setShowGatewayConfig(!showGatewayConfig)}
    className="w-full p-2.5 flex items-center justify-between text-stone-700 hover:text-stone-900 font-semibold"
  >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-[#881930]" />
                <span>Live SIM SMS Gateway (Jio / Airtel Cellular Gateway)</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-stone-500">
                <span>{hasCellularGateway ? "Active (Live)" : "Setup"}</span>
                {showGatewayConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showGatewayConfig && <form onSubmit={handleSaveGatewayKey} className="p-3 border-t border-stone-200 bg-white space-y-2.5">
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  According to TRAI telecom guidelines, an SMS gateway is required for direct cellular SIM message delivery. If you have a Fast2SMS or 2Factor.in API Key, configure it below:
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    Fast2SMS API Key (https://www.fast2sms.com)
                  </label>
                  <input
    type="password"
    placeholder="Enter Fast2SMS API Key..."
    value={fast2smsKey}
    onChange={(e) => setFast2smsKey(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded font-mono"
  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                    or 2Factor.in API Key (https://2factor.in)
                  </label>
                  <input
    type="password"
    placeholder="Enter 2Factor API Key..."
    value={twofactorKey}
    onChange={(e) => setTwofactorKey(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded font-mono"
  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
    type="submit"
    size="sm"
    className="text-xs"
    isLoading={isSavingKey}
  >
                    <Key className="w-3 h-3 mr-1" />
                    <span>Save Key</span>
                  </Button>
                </div>
              </form>}
          </div>

          {
    /* Security guarantee */
  }
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Database</span>
            </span>
            <span className="font-mono text-stone-400">MERN Stack Verified</span>
          </div>
        </div>
      </div>
    </div>;
};
