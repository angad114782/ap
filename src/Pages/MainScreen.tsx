import Bg from "@/assets/Untitled design (12).png";
import { BookText, Home, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneImage from "../assets/Blue 3D and modern Crypto currency smartphone Poster (1).png";
import { Button } from "@/components/ui/button";
import InvestIcon from "../assets/Invest.svg";
import ApartXPoster from "../assets/Apart-x poster.svg";
import Meshgradient from "../assets/mesh-gradient 1.svg";
import ReceiveDollar from "../assets/Recive Dollar.svg";
import ReferAndEarn from "../assets/ReferAndEarn.svg";
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
      toast.error("Failed to load wallet balance");
      localStorage.removeItem("token");
      navigate("/login-register");
    } finally {
      setIsLoading(false);
    }
  };

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
      setName(data.name || "User");

      if (data.profilePic) {
        const baseUrl = import.meta.env.VITE_URL.replace("/api", "");
        let imageUrl;
        if (data.profilePic.startsWith("http")) {
          imageUrl = data.profilePic;
        } else if (data.profilePic.startsWith("/")) {
          imageUrl = `${baseUrl}${data.profilePic}`;
        } else {
          imageUrl = `${baseUrl}/${data.profilePic}`;
        }

        const img = new Image();
        img.onload = () => setProfilePic(imageUrl);
        img.onerror = () => setProfilePic(null);
        img.src = imageUrl;
      } else {
        setProfilePic(null);
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
      setName("User");
      setProfilePic(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#2D2B2B]">
      <div className="absolute inset-0 z-10">
        <img
          src={Bg}
          alt="Flower Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      {/* Main scrollable content wrapper */}
      <div className="relative z-20 h-full overflow-y-auto pb-20 flex flex-col min-h-screen">
        {/* Scrollable top content */}
        <div className="flex-grow">
          <div className="sm:flex-col sm:items-start portrait:items-center-safe portrait:flex gap-2 mb-2 mt-4 px-4">
            {isProfileLoading ? (
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

          <div className="px-4">
            <div
              className="w-full p-4 rounded-[20px] bg-cover bg-center shadow-md mb-6 text-black"
              style={{ backgroundImage: `url(${Meshgradient})` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Wallet Balance</span>
                  <img src={usdtblack} alt="" className="h-[20px] w-[20px]" />
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
          </div>

          <div className="px-4">
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
          </div>

          <div className="w-full mb-6 px-4">
            <BannerCarousel button={false} />
          </div>
        </div>

        {/* === About Section pinned at bottom initially === */}
        <div className="w-full  min-sm:mt-48 ">
          <div className="flex items-center justify-center mb-4 px-4">
            <div className="w-auto">
              <img
                src={PhoneImage}
                alt="Phone"
                className="sm:h-[200px] xl:h-[150px] xl:w-[110px] portrait:h-[150px] portrait:w-[105px] sm:w-[140px] object-contain"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-white text-left text-lg xl:text-lg xl:leading-5 portrait:text-xl sm:text-2xl portrait:leading-4.5 leading-tight font-medium">
                Get Detail
                <br />
                insight about
                <br /> Apart-x
              </h3>
              <button
                onClick={() => navigate("/pdf-viewer")}
                className="text-white bg-red-600 rounded-full px-3 py-1.5 text-[14px] xl:text-[8px] portrait:text-[10px] sm:text-[16px] font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl w-fit"
              >
                About Apart-X
              </button>
            </div>
          </div>

          {/* === Poster Below About Section === */}
          <div className="w-full">
            <img
              src={ApartXPoster}
              alt="Apart-X Poster"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* === Bottom Navigation === */}
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
