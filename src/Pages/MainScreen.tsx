import Bg from "@/assets/Untitled design (12).png";
import { BookText, Home, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import USDTLogo from "../assets/usdt logo.svg";
import PhoneImage from "../assets/Blue 3D and modern Crypto currency smartphone Poster (1).png";

import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import InvestIcon from "../assets/Invest.svg";
import Meshgradient from "../assets/mesh-gradient 1.svg";
import ReceiveDollar from "../assets/Recive Dollar.svg";
import ReferAndEarn from "../assets/ReferAndEarn.svg";
// import SendDollar from "../assets/Send Dollar.svg";
import usdtblack from "../assets/UsdtBlack.svg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BannerCarousel from "@/components/CaraouselBanner";
import { MyWalletsManagement } from "@/components/MyWalletsManagement";

const MainScreen = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Fetch wallet balance on component mount
  useEffect(() => {
    getWalletBalance();
    fetchUserProfile();
  }, []);

  const getWalletBalance = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login-register");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_URL}/wallets/virtual-balance`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) throw new Error("401");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    setWalletBalance(data.totalBalance || 0);
  } catch (error) {
    toast.error("Failed to load wallet balance"); {
      localStorage.removeItem("token");
      navigate("/login-register");
    }
  } finally {
    setIsLoading(false);
  }
};

// const [showWalletManager, setShowWalletManager] = useState(false);
  const fetchUserProfile = async () => {
    setIsProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login-register");
          toast.error("Session expired. Please login again.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User profile data:", data); // Debug log

      // Set user name
      setName(data.name || "User");

      // Handle profile picture
      if (data.profilePic) {
        // Remove /api from the base URL to get the correct server URL
        const baseUrl = import.meta.env.VITE_URL.replace("/api", "");

        // Construct the full image URL
        let imageUrl;
        if (data.profilePic.startsWith("http")) {
          // If it's already a full URL
          imageUrl = data.profilePic;
        } else if (data.profilePic.startsWith("/")) {
          // If it starts with /, just append to baseUrl
          imageUrl = `${baseUrl}${data.profilePic}`;
        } else {
          // If it doesn't start with /, add a /
          imageUrl = `${baseUrl}/${data.profilePic}`;
        }

        console.log("Constructed image URL:", imageUrl); // Debug log

        // Test if the image loads
        const img = new Image();
        img.onload = () => {
          console.log("Image loaded successfully");
          setProfilePic(imageUrl);
        };
        img.onerror = (e) => {
          console.error("Failed to load image:", {
            error: e,
            attemptedUrl: imageUrl,
            originalPath: data.profilePic,
          });
          setProfilePic(null);
        };
        img.src = imageUrl;
      } else {
        setProfilePic(null);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch profile");
      setName("User"); // Fallback name
      setProfilePic(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // const currencyConfig = [{ label: "USDT", value: "$ 0.00", icon: USDTLogo }];

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#2D2B2B]">
      {/* === Background Images === */}
      <div className="absolute inset-0 z-10">
        <img
          src={Bg}
          alt="Flower Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      {/* === Scrollable Foreground Content === */}
      <div className="relative z-20 h-full overflow-y-auto pb-20 px-4">
        {/* User Greeting */}
        <div className="  sm:flex-col sm:items-start portrait:items-center-safe portrait:flex gap-2 mb-2 mt-4">
          {isProfileLoading ? (
            // Loading state for profile picture
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          ) : profilePic ? (
            <img
              onClick={() => navigate("/profile")}
              src={profilePic}
              className="rounded-full w-12 h-12 object-cover border-2 border-white cursor-pointer"
              alt="Profile"
            />
          ) : (
            <User2Icon
              onClick={() => navigate("/profile")}
              className="w-12 h-12 rounded-full bg-white border-black border-2 cursor-pointer"
            />
          )}

          <h1 className="text-white text-lg font-medium">
            {isProfileLoading ? "Loading..." : `Hello ${name}`}
          </h1>
        </div>

        {/* Wallet Card */}
        <div
          className="w-full p-4 rounded-[20px] bg-cover bg-center shadow-md mb-6 text-black"
          style={{ backgroundImage: `url(${Meshgradient})` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Wallet Balance</span>
              <img
                src={usdtblack}
                alt=""
                className="h-[20px] fill-black w-[20px]"
              />
              <span className="text-2xl md:text-3xl font-bold mt-2">
                {isLoading ? "Loading..." : `$ ${walletBalance.toFixed(2)}`}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/select-wallet-receive")}
                className="bg-orange-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-1.5 rounded-full shadow-md border border-orange-300"
              >
                Withdraw
              </button>
              <button
                onClick={() => navigate("/select-wallet-send")}
                className="bg-purple-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-1.5 rounded-full shadow-md border border-purple-400"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Send / Receive Actions */}
        <div className="bg-[#111111] rounded-2xl py-4 px-4 sm:px-6 flex justify-around items-center mb-6 text-white">
          <div className="flex flex-col justify-center items-center gap-1">
           
                      <MyWalletsManagement />
          </div>
          <div className="h-6 w-px bg-white opacity-40" />
          <div className="flex flex-col items-center gap-1">
            <img
              onClick={() => navigate("/portfolio")}
              src={ReceiveDollar}
              alt="Receive"
              className="h-7 w-7 sm:h-8 sm:w-8"
            />
            <span className="text-xs sm:text-sm">View Portfolio</span>
          </div>
          <div className="h-6 w-px bg-white opacity-40" />
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => navigate("/investment-plan")}>
              <img
                src={InvestIcon}
                alt="Invest"
                className="h-7 w-7 sm:h-8 sm:w-8"
              />
              <span className="text-xs sm:text-sm text-center">Invest</span>
            </button>
          </div>
        </div>

        {/* Crypto Balances */}
        {/* <div className="text-white mb-4">
          <h2 className="text-lg font-semibold mb-3">Crypto Balance</h2>
          <div className="bg-[#111111] rounded-2xl px-4 sm:px-8 p-4 space-y-4">
            {currencyConfig.map((coin, index) => (
              <div key={coin.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.icon}
                      alt={coin.label}
                      className="h-8 w-8 sm:h-12 sm:w-12"
                    />
                    <span className="text-base sm:text-lg">{coin.label}</span>
                  </div>
                  <span className="text-green-400 text-base sm:text-lg font-medium">
                    {isLoading ? "Loading..." : `$ ${walletBalance}`}
                  </span>
                </div>
                {index < currencyConfig.length - 1 && (
                  <Separator className="bg-white/20 my-3" />
                )}
              </div>
            ))}
          </div>
        </div> */}
        <div className="w-full">
          <BannerCarousel button={false} />
        </div>
        {/* Bottom Text and About Button */}
        <div className="fixed bottom-12 left-0 right-0 z-20 px-4 max-w-lg mx-auto">
          <div className="flex items-center justify-center">
            {/* Phone Imagse */}
            <div className="w-auto">
              <img
                src={PhoneImage}
                alt="Phone"
                className="sm:h-[200px] xl:h-[150px] xl:w-[110px] portrait:h-[150px] portrait:w-[105px]  sm:w-[140px] object-contain"
              />
            </div>

            {/* Text and Button Container */}
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-white text-left text-lg xl:text-lg xl:leading-5 portrait:text-xl sm:text-2xl portrait:leading-4.5 leading-tight font-medium">
                Get Detail
                <br />
                insight about
                <br /> Apart-x
              </h3>
              <button
                onClick={() => navigate("/pdf-viewer")}
                className="text-white bg-red-600 rounded-full px-3 py-1.5 text-[14px] xl:text-[8px] portrait:text-[10px] sm:text-[16px] font-semibold
    hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl w-fit"
              >
                About Apart-X
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-lg w-full bg-[#171717] py-4 flex justify-around items-center z-30 rounded-t-xl shadow-inner">
        <div className="flex gap-2 items-center text-white">
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </div>
        <Button
          onClick={() => navigate("/passbook")}
          className="flex gap-2 items-center text-white"
        >
          <BookText className="w-5 h-5" />
          <span className="text-xs mt-1">Passbook</span>
        </Button>
        <Button
          onClick={() => navigate("/invite-and-earn")}
          className="flex gap-2 items-center"
        >
          <img src={ReferAndEarn} alt="Invite & Earn" />
          <span className="text-[10px] text-center text-white leading-tight">
            Invite &<br />
            Earn
          </span>
        </Button>
      </div>
    </div>
  );
};

export default MainScreen;
