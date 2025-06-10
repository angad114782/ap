import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Binance from "../assets/3495812.svg";
import CoinBase from "../assets/Coinbase.svg";
import MetaMask from "../assets/fox.svg";
import Line from "../assets/Line 3 (1).svg";
import ReceiptBg from "../assets/ReceiptBg.tsx.svg";
import TransferCard from "../assets/Subtract.svg";
import TrustWallet from "../assets/TrustWallet.svg";

const RequestSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, walletType } = location.state || {};
  const [walletAddress, setWalletAddress] = useState("");

  // Helper function to get wallet logo
  const getWalletLogo = (type: string) => {
    switch (type?.toLowerCase()) {
      case "binance":
        return Binance;
      case "metamask":
        return MetaMask;
      case "coinbase":
        return CoinBase;
      case "trustwallet":
        return TrustWallet;
      default:
        return undefined;
    }
  };

  // Add useEffect to fetch wallet address when component mounts
  useEffect(() => {
    const fetchWalletAddress = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/wallet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Find the matching wallet by type
        const selectedWallet = response.data.wallets.find(
          (w: any) => w.walletType.toLowerCase() === walletType?.toLowerCase()
        );

        if (selectedWallet) {
          setWalletAddress(selectedWallet.walletID);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    };

    if (walletType) {
      fetchWalletAddress();
    }
  }, [walletType]);

  return (
    <div
      className="h-full w-full bg-cover bg-no-repeat bg-center flex flex-col items-center px-4 py-4"
      style={{ backgroundImage: `url(${ReceiptBg})` }}
    >
      {/* Back button */}
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Card Container - Centered and Scaled */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Title above card - responsive text size */}
        <div className="text-white text-lg sm:text-xl md:text-2xl font-semibold text-center mb-3 sm:mb-4">
          Request Submitted
        </div>

        {/* Responsive Card Container */}
        <div
          className="relative w-full h-auto max-h-full aspect-[3/5]"
          style={{ maxWidth: "min(85%, 320px)" }}
        >
          {/* Card Background */}
          <img
            src={TransferCard}
            alt="Transfer Card"
            className="w-full h-full object-contain"
          />

          {/* Divider Line */}
          <img
            src={Line}
            alt="Divider"
            className="absolute top-[53%] left-1/2 transform -translate-x-1/2 w-[90%] pointer-events-none"
          />

          {/* Card Content Overlay with responsive text */}
          <div className="absolute inset-0 flex flex-col p-3 sm:p-4">
            {/* Top Section */}
            <div className="flex-[0.53] flex flex-col">
              {/* Top Checkmark - responsive size */}
              <div className="flex justify-center pt-1">
                <CircleCheck className="w-24 h-24 sm:w-16 sm:h-16 md:w-20 md:h-20 fill-green-500 text-black" />
              </div>

              {/* Transfer Message - responsive text */}
              <div className="text-center mt-1 flex-grow flex flex-col justify-center">
                <p className="text-black text-sm sm:text-base font-semibold">
                  Request Submitted
                </p>
                <p className="text-[10px] sm:text-xs text-black">
                  Your request for receiving crypto currency has been
                  successfully submitted.
                </p>
                <p className="mt-1 text-base sm:text-base font-normal text-black">
                  Total Transfer
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">
                  {amount || 0}
                </p>
              </div>
            </div>

            {/* Bottom Section - Vertically centered with responsive text */}
            <div className="flex-[0.45] flex flex-col  justify-center">
              <div className="text-center w-full">In wallet</div>
              <div className="bg-black w-[160px] mb-2 items-center rounded-lg justify-evenly h-[50px] mx-auto flex">
                <img
                  className="h-[50px] w-[50px]"
                  src={getWalletLogo(walletType)}
                  alt={walletType || ""}
                />
                <div className="text-white text-[12px]">
                  {walletType
                    ? walletType.charAt(0).toUpperCase() + walletType.slice(1)
                    : ""}
                </div>
              </div>
              <p className="text-black text-[10px] sm:text-xs font-semibold mb-1">
                Transfer Destination
              </p>
              <div className="bg-red-200 rounded-md px-2 py-1 text-black text-[10px] sm:text-xs break-words">
                {walletAddress || "No wallet address found"}
              </div>
              <Button
                onClick={() => navigate("/main-screen")}
                className="mt-2 sm:mt-3 w-full  bg-green-600 text-white rounded-[16px] hover:bg-green-700 text-xs sm:text-sm py-1"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmitted;
