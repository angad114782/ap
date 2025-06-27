import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import SmallLine from "../assets/smallLine.svg"; // Placeholder for the small line image
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react"; // Optional: lucide icon
import { toast } from "sonner";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [referralId, setReferralId] = useState("");
  const [loading, setLoading] = useState(false);

  // Add useEffect to check URL parameters on component mount
  useEffect(() => {
    const referralFromUrl = searchParams.get("ref");
    if (referralFromUrl) {
      setReferralId(referralFromUrl);
    }
  }, [searchParams]);

const handleRegister = async () => {
  try {
    setLoading(true);

    if (!phone || !password || !referralId || !email) {
      toast.error("All fields are required");
      return;
    }

    const formattedMobile = phone.startsWith("+") ? phone : `+${phone}`;
    const deviceId = Math.random().toString(36).substring(7);

    // 🔁 Call OTP API, NOT actual registration
    const response = await axios.post(`${import.meta.env.VITE_URL}/send-register-otp`, {
      mobile: formattedMobile,
      email,
      password,
      referralCode: referralId,
      deviceId,
    });

    if (response.status === 200) {
      localStorage.setItem("deviceId", deviceId);
      toast.success("OTP sent to your email");
      navigate("/reg-otp", {
        state: {
          email: email.trim(),
          from: "registration",
        },
      });
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to send OTP");
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
            Create an Account
          </h2>
          <p className="text-[#F7F7F7] text-sm mt-1">
            Enter your mobile number to verify your account
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 mt-10">
          {/* Phone Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium text-sm">Phone</label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={setPhone}
              inputStyle={{
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "white",
                paddingLeft: "48px",
              }}
              buttonStyle={{
                border: "none",
                backgroundColor: "transparent",
              }}
              dropdownStyle={{
                backgroundColor: "#1e1e1e",
                color: "white",
              }}
              containerStyle={{
                width: "100%",
              }}
              inputProps={{
                name: "phone",
                required: true,
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium text-sm">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-4 border border-white rounded-xl bg-transparent text-white placeholder:text-[#6B6B6B] outline-none"
            />
          </div>
          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium text-sm">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 border border-white rounded-xl bg-transparent text-white placeholder:text-[#6B6B6B] outline-none"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium text-sm">
              Enter Referral ID
            </label>
            <input
              type="text"
              placeholder="Enter Referral ID"
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              className="h-12 px-4 border border-white rounded-xl bg-transparent text-white placeholder:text-[#6B6B6B] outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Button
            className="w-full h-12 bg-[#6552FE] hover:bg-slate-500 text-white font-semibold rounded-[16px]"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
