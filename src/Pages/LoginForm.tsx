import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!phoneNumber || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      const formattedMobile = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;
      const deviceId = window.navigator.userAgent;

      const response = await axios.post(`${import.meta.env.VITE_URL}/login`, {
        mobile: formattedMobile,
        password: password,
        deviceId: deviceId,
      });
      console.log("Login response:", response);

      const data = response.data;
      console.log("Login data:", data);
      // Save token and role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("profilePic", JSON.stringify(data.profilePic));
      localStorage.setItem("user", JSON.stringify(data.user));

      localStorage.setItem("role", data.role);
      login(data.token, data.role); // This will automatically redirect based on role
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] px-3 py-6">
      {/* 1. Header (always at top) */}
      <div className="flex-none text-center">
        <div className="text-white text-xl font-bold">
          Apart-<span className="text-[#6552FE]">X</span>
        </div>
        <div className="mt-3 font-medium text-[#F7F7F7] text-[32px] leading-tight">
          Let's Get Started
        </div>
      </div>

      {/* 2. Center box (grows to fill, then centers its children) */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <PhoneInput
          country={"in"}
          value={phoneNumber}
          onChange={setPhoneNumber}
          inputStyle={{
            width: "100%",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "white",
            border: "1px solid white",
            color: "black",
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
            placeholder: "Login / Mobile No.",
          }}
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="h-12 bg-white rounded-lg px-4 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOffIcon size={30} /> : <EyeIcon size={30} />}
          </button>
        </div>
        <div
          onClick={() => navigate("/forget-password")}
          className="text-white no-underline text-right text-sm cursor-pointer"
        >
          Forgot Password?
        </div>
      </div>

      {/* 3. Footer (flex-none, sits at bottom of the outer flex) */}
      <div className="flex-none space-y-3">
        <Button
          className="w-full h-12 bg-white text-black font-semibold rounded-[16px] hover:bg-slate-500"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button
          className="w-full h-12 bg-[#6552FE] text-white font-semibold hover:bg-slate-500 rounded-[16px]"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
