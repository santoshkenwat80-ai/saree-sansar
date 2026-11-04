import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email or mobile number");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    setIsLoading(true);
    const success = await login(cleanEmail, password);
    setIsLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FCF9F5] to-stone-100">
      {
    /* Main Login Card */
  }
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xl space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#881930] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patron Access · Member Sign In</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Sign In to Saree Sansar
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            Enter your email or mobile number and password to sign in.
          </p>
        </div>

        {
    /* Clean Password Login Form - Empty Fields */
  }
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email or 10-Digit Mobile Number
            </label>
            <div className="relative">
              <input
    type="text"
    required
    placeholder="Enter your email or mobile number"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
    type={showPassword ? "text" : "password"}
    required
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 focus:border-[#881930] transition-all"
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
    to="/forgot-password"
    className="text-[#881930] hover:text-[#6b1426] font-medium hover:underline transition-colors ml-auto"
  >
              Forgot password?
            </Link>
          </div>

          <Button
    type="submit"
    size="lg"
    className="w-full flex items-center justify-center gap-2 bg-[#881930] hover:bg-[#6b1426] text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-98"
    isLoading={isLoading}
  >
            <Lock className="w-4 h-4" />
            <span>Sign In with Password</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>New to Saree Sansar? </span>
          <Link to="/register" className="font-semibold text-[#881930] hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>;
};
export default Login;
