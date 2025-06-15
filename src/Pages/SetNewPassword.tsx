import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetPassword = async () => {
    try {
      setLoading(true);

      if (!newPassword || !confirmPassword) {
        toast.error("Please fill in both fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!email) {
        toast.error("Invalid or missing email");
        return;
      }

      await axios.post(`${import.meta.env.VITE_URL}/reset-password`, {
  email,
  newPassword,
});



      toast.success("Password reset successfully");
      navigate("/login-register");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] px-3 py-6">
      <div className="flex-none text-center">
        <div className="text-white text-xl font-bold">
          Apart-<span className="text-[#6552FE]">X</span>
        </div>
        <div className="mt-3 font-medium text-[#F7F7F7] text-[32px] leading-tight">
          Set New Password
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
            className="h-12 bg-white rounded-lg px-4 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOffIcon size={30} /> : <EyeIcon size={30} />}
          </button>
        </div>

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="h-12 bg-white rounded-lg px-4 w-full"
          />
        </div>
      </div>

      <div className="flex-none space-y-3">
        <Button
          className="w-full h-12 bg-[#6552FE] text-white font-semibold rounded-[16px] hover:bg-opacity-80"
          onClick={handleSetPassword}
          disabled={loading}
        >
          {loading ? "Saving..." : "Set Password"}
        </Button>
        <Button
          className="w-full h-12 bg-white text-black font-semibold hover:bg-slate-200 rounded-[16px]"
          onClick={() => navigate("/login-register")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default SetNewPassword;
