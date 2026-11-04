import { useState, useEffect } from "react";
import {
  Building,
  Home,
  Briefcase,
  ShieldCheck,
  Save
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isValidIndianPhone, isValidIndianPincode } from "../../utils/validators";
import { lookupPincode } from "../../utils/pincode";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import toast from "react-hot-toast";
export const AddressModalWithOtp = ({
  isOpen,
  onClose,
  onSuccess,
  initialAddress,
  title = "Delivery Address Details"
}) => {
  const { user, addAddress, updateAddress } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [type, setType] = useState("HOME");
  const [isDefault, setIsDefault] = useState(true);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (isOpen) {
      if (initialAddress) {
        setFullName(initialAddress.fullName || user?.name || "");
        setPhone(initialAddress.phone || user?.phone || "");
        setAlternatePhone(initialAddress.alternatePhone || "");
        setPincode(initialAddress.pincode || "");
        setState(initialAddress.state || "");
        setCity(initialAddress.city || "");
        setLocality(initialAddress.locality || "");
        setAddressLine(initialAddress.addressLine || "");
        setLandmark(initialAddress.landmark || "");
        setType(initialAddress.type || "HOME");
        setIsDefault(initialAddress.isDefault ?? true);
      } else {
        setFullName(user?.name || "");
        setPhone(user?.phone || "");
        setAlternatePhone("");
        setPincode("");
        setState("");
        setCity("");
        setLocality("");
        setAddressLine("");
        setLandmark("");
        setType("HOME");
        setIsDefault(true);
      }
    }
  }, [isOpen, initialAddress, user]);
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);
    setPincode(cleanPin);
    if (cleanPin.length === 6) {
      setIsLookingUpPin(true);
      try {
        const found = await lookupPincode(cleanPin);
        if (found) {
          if (!city || city === "") setCity(found.city);
          if (!state || state === "") setState(found.state);
          toast.success(`Location detected: ${found.city}, ${found.state}`, { icon: "\u{1F4CD}", duration: 2500 });
        }
      } catch {
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!isValidIndianPhone(cleanPhone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!isValidIndianPincode(pincode)) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }
    if (!city.trim() || !state.trim()) {
      toast.error("City and State are required");
      return;
    }
    if (!addressLine.trim()) {
      toast.error("Address line is required");
      return;
    }
    setIsSaving(true);
    try {
      const addressData = {
        fullName: fullName.trim(),
        phone: cleanPhone,
        alternatePhone: alternatePhone ? alternatePhone.replace(/\D/g, "").slice(-10) : void 0,
        pincode: pincode.trim(),
        state: state.trim(),
        city: city.trim(),
        locality: locality.trim() || city.trim(),
        addressLine: addressLine.trim(),
        landmark: landmark.trim() || void 0,
        type,
        isDefault
      };
      if (initialAddress?.id) {
        await updateAddress(initialAddress.id, addressData);
        const updatedAddress = {
          ...addressData,
          id: initialAddress.id
        };
        toast.success("Address updated successfully!");
        onSuccess(updatedAddress);
      } else {
        const saved = await addAddress(addressData);
        if (saved) {
          onSuccess(saved);
        } else {
          const fallback = {
            ...addressData,
            id: `addr-${Date.now()}`
          };
          onSuccess(fallback);
        }
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Error saving address");
    } finally {
      setIsSaving(false);
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSaveAddress} className="space-y-4">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Secure Delivery:</strong> This address will be safely stored in your account for easy future checkouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
    label="Full Name *"
    type="text"
    required
    placeholder="e.g. Santosh Kumar"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
  />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mobile Number (10-Digit Mobile Number) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                +91
              </span>
              <input
    type="tel"
    required
    maxLength={10}
    placeholder="6267961163"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
    className="w-full pl-14 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#881930] focus:ring-1 focus:ring-[#881930] font-mono tracking-wide"
  />
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">Contact number for courier delivery updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <Input
    label="PIN Code (6-Digit PIN Code) *"
    type="text"
    required
    maxLength={6}
    placeholder="e.g. 492001 or 221001"
    value={pincode}
    onChange={(e) => handlePincodeChange(e.target.value)}
  />
            {isLookingUpPin && <span className="text-[10px] text-[#881930] animate-pulse">Looking up city...</span>}
          </div>

          <Input
    label="City / District *"
    type="text"
    required
    placeholder="e.g. Raipur / Varanasi"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />

          <Input
    label="State *"
    type="text"
    required
    placeholder="e.g. Chhattisgarh / Uttar Pradesh"
    value={state}
    onChange={(e) => setState(e.target.value)}
  />
        </div>

        <Input
    label="House / Flat / Road / Street *"
    type="text"
    required
    placeholder="e.g. House No. 24, Main Road, Block B"
    value={addressLine}
    onChange={(e) => setAddressLine(e.target.value)}
  />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
    label="Locality / Area"
    type="text"
    placeholder="e.g. Shanti Nagar / Assi Ghat"
    value={locality}
    onChange={(e) => setLocality(e.target.value)}
  />

          <Input
    label="Landmark (Optional)"
    type="text"
    placeholder="e.g. Near Temple / Opposite Main Square"
    value={landmark}
    onChange={(e) => setLandmark(e.target.value)}
  />
        </div>

        {
    /* Address Type Selection */
  }
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Address Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
    { id: "HOME", label: "Home", icon: Home },
    { id: "WORK", label: "Work", icon: Briefcase },
    { id: "OTHER", label: "Other", icon: Building }
  ].map((item) => {
    const Icon = item.icon;
    const isSelected = type === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => setType(item.id)}
      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${isSelected ? "border-[#881930] bg-rose-50/50 text-[#881930] font-bold shadow-2xs" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
    >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>;
  })}
          </div>
        </div>

        {
    /* Set as Default Checkbox */
  }
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
    type="checkbox"
    checked={isDefault}
    onChange={(e) => setIsDefault(e.target.checked)}
    className="w-4 h-4 rounded text-[#881930] focus:ring-[#881930]"
  />
          <span className="text-xs text-stone-700">
            Make this my default delivery address
          </span>
        </label>

        {
    /* Submit Action */
  }
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSaving} className="px-5">
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialAddress?.id ? "Update Address" : "Save Address"}</span>
          </Button>
        </div>
      </form>
    </Modal>;
};
