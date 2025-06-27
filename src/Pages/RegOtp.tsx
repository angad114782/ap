import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RegOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, from } = location.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      if (!otp || otp.length !== 6) {
        toast.error("Please enter a valid OTP");
        return;
      }

      // Verify OTP
      await axios.post(`${import.meta.env.VITE_URL}/reg-otp`, {
        email,
        otp,
        type: from, // Send type to differentiate between different OTP purposes
      });

      toast.success("OTP verified successfully");

      // If from forgot password, navigate to main screen
      if (from === "registration") {
  navigate("/login-register");
}

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Add resend OTP functionality
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_URL}/resend-register-otp`, {
  email,
});

      toast.success("New OTP sent to your email");
    } catch (error: any) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707]  py-6 ">
      {/* Top Back Button + Line */}
      <div className="flex flex-col gap-2 mb-6">
        <button
          onClick={() => navigate("/login-register")}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className=" h-8 w-8 m-1 text-white" />
        </button>
        <div className="border-t  border-white border-4 w-full" />
      </div>

      <div className=" flex flex-col gap-6 w-full px-3 h-full">
        {/* Header */}
        <div className="flex-none text-start">
  <h2 className="mt-3 font-medium text-[#F7F7F7] text-[28px] leading-tight">
    Confirm your email address
  </h2>
  <p className="text-[#F7F7F7] text-sm mt-1">
    We sent a 6-digit code to <span className="font-semibold">{email}</span>
  </p>
</div>


        {/* Form */}
        <div className="flex flex-col gap-5 mt-10 items-center text-white">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            className="w-full"
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="text-3xl font-semibold" />
              <InputOTPSlot index={1} className="text-3xl font-semibold" />
              <InputOTPSlot index={2} className="text-3xl font-semibold" />
              <InputOTPSlot index={3} className="text-3xl font-semibold" />
              <InputOTPSlot index={4} className="text-3xl font-semibold" />
              <InputOTPSlot index={5} className="text-3xl font-semibold" />
            </InputOTPGroup>
          </InputOTP>
          <div className="text-base leading-[18px]">
            Didn't get a code?{" "}
            <button
              onClick={handleResendOTP}
              className="text-[#6552FE] font-semibold"
            >
              Resend.
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Button
            className="w-full h-12 bg-[#6552FE] text-white font-semibold rounded-[16px]"
            onClick={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegOtp;