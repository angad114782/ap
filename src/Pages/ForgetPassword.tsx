import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      if (!email) {
        toast.error("Please enter your email address");
        return;
      }

      // Send request to get OTP
      await axios.post(`${import.meta.env.VITE_URL}/forgot-password`, {
        email: email.trim(),
      });

      // Navigate to OTP page with email
      navigate("/enter-otp", {
        state: {
          email: email.trim(),
          from: "forgot-password",
        },
      });

      toast.success("OTP sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] px-3 py-6">
      {/* Back Button */}
      <div className="flex-none">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Header */}
      <div className="flex-none text-center mt-4">
        <div className="text-white text-xl font-bold">
          Apart-<span className="text-[#6552FE]">X</span>
        </div>
        <div className="mt-3 font-medium text-[#F7F7F7] text-[32px] leading-tight">
          Reset Password
        </div>
        <div className="mt-2 text-gray-400 text-sm">
          Enter your email address to receive password reset instructions
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email Address"
          className="h-12 bg-white rounded-lg px-4 w-full"
        />
      </div>

      {/* Footer */}
      <div className="flex-none space-y-3">
        <Button
          className="w-full h-12 bg-[#6552FE] text-white font-semibold rounded-[16px] hover:bg-opacity-80"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
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

export default ForgetPassword;
