import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Lock, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
const isValidIndianPhone = (phone) => {
  const clean = phone.replace(/\D/g, "");
  return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
};
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!isValidIndianPhone(cleanPhone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const success = await register(name.trim(), email.trim(), cleanPhone, password);
      if (success) {
        toast.success(`Welcome ${name.trim()}! Your account has been created successfully.`, { icon: "\u{1F451}" });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FCF9F5] to-stone-100">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xl space-y-6">
        {
    /* Header */
  }
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#881930] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Patron Circle · Exclusive Membership</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            Enter your details and a secure password to create your account.
          </p>
        </div>

        {
    /* Pure Password Registration Form */
  }
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {
    /* Full Name */
  }
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
    type="text"
    required
    placeholder="e.g. Priya Sharma"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
            </div>
          </div>

          {
    /* Email Address */
  }
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
    type="email"
    required
    placeholder="e.g. santosh@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
            </div>
          </div>

          {
    /* Mobile Number */
  }
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              10-Digit Mobile Number
            </label>
            <div className="relative flex rounded-xl shadow-2xs">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-800 text-xs font-bold">
                🇮🇳 +91
              </span>
              <input
    type="tel"
    required
    maxLength={10}
    placeholder="9876543210"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-r-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
            </div>
          </div>

          {
    /* Password */
  }
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Create Password (min. 6 characters)
            </label>
            <div className="relative">
              <input
    type={showPassword ? "text" : "password"}
    required
    minLength={6}
    placeholder="At least 6 characters"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {
    /* Confirm Password */
  }
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
    type={showPassword ? "text" : "password"}
    required
    minLength={6}
    placeholder="Re-enter your password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
            </div>
          </div>

          {
    /* Benefits Note */
  }
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Secure &amp; Encrypted Account System · No Spam</span>
          </div>

          <Button
    type="submit"
    size="lg"
    className="w-full flex items-center justify-center gap-2 bg-[#881930] hover:bg-[#6b1426] text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98"
    isLoading={isLoading}
  >
            <Lock className="w-4 h-4" />
            <span>Create Account</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-[#881930] hover:underline">
            Sign In with Password
          </Link>
        </div>
      </div>
    </div>;
};
export default Register;
