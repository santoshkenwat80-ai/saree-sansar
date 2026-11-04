import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import toast from "react-hot-toast";
export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter admin credentials");
      return;
    }
    setIsLoading(true);
    const success = await login(email.trim(), password, true);
    setIsLoading(false);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid administrative credentials");
    }
  };
  return <div className="min-h-screen bg-[#190409] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#6b1426] text-[#f2ce6e] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Saree Sansar Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Authorized administrative store owner &amp; operator portal
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <Input
    label="Admin Email"
    type="email"
    required
    placeholder="Enter admin email (e.g. santoshkumarkenwat2@gmail.com)"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

          <Input
    label="Security Password"
    type="password"
    required
    placeholder="Enter your security password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

          <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
            <Lock className="w-4 h-4 mr-2" />
            <span>Authenticate &amp; Enter Console</span>
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
    onClick={() => navigate("/")}
    className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
  >
            ← Return to Consumer Storefront
          </button>
        </div>
      </div>
    </div>;
};
export default AdminLogin;
