import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Combobox from "@/components/ComboBox";
import USDTLOGO from "../assets/usdt logo.svg";

import Binance from "../assets/3495812.svg";
import MetaMask from "../assets/fox.svg";
import CoinBase from "../assets/Coinbase.svg";
import TrustWallet from "../assets/TrustWallet.svg";

const getWalletLogo = (type: string) => {
  switch (type.toLowerCase()) {
    case "binance":
      return Binance;
    case "metamask":
      return MetaMask;
    case "coinbase":
      return CoinBase;
    case "trustwallet":
      return TrustWallet;
    default:
      return null;
  }
};

const ReceiveFinal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]); // ✅ Ensures it's never undefined
  const [walletType, setWalletType] = useState<string>("");
  const [walletID, setWalletID] = useState<string>("");
  const { amount } = location.state || {};

  useEffect(() => {
    const fetchUserWallets = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/wallet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWallets(response.data.data);
      } catch (error) {
        console.error("Error fetching wallets:", error);
        toast.error("Failed to fetch wallets");
      }
    };

    fetchUserWallets();
  }, []);

  // Add this useEffect to monitor walletType changes
  useEffect(() => {
    console.log("Current walletType:", walletType);
    console.log("Current walletType:", walletID);
  }, [walletType]);

  const handleComboboxOpen = (isOpen: boolean) => {
    if (isOpen) {
      setWallets(wallets);
    }
  };

  // Add console log to check value being set
  const handleWalletChange = (value: string, id?: string) => {
  setWalletType(value);
  setWalletID(id || ""); // fallback
};


  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }

      if (!amount || !walletType) {
        toast.error("Please select a wallet and enter amount");
        return;
      }
console.log("💥 Sending to API:", {
  amount: parseFloat(amount),
  wallet: walletType,
  walletID,
});

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/receive`,
        {
          amount: parseFloat(amount),
          wallet: walletType,
          walletID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Request submitted successfully");
        navigate("/request-submitted", {
          state: {
            amount: amount,
            walletType: walletType,
          },
        });
      }
    } catch (error: any) {
      console.error("Error submitting receive request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] py-6 overflow-y-auto overflow-x-hidden px-3">
      {/* Top Back Button + Line */}
      <div className="flex flex-col gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className="h-8 w-8 m-1 text-white" />
        </button>
        <div className="border-t border-white border-4 w-full" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-full flex-grow">
        {/* Header */}
        <div className="flex-none text-start">
          <h2 className="mt-3 font-medium text-[#F7F7F7] text-[22px] leading-tight">
            Select your blockchain wallet
          </h2>
          <p className="text-[#F7F7F7] text-sm mt-1">
            Select your wallet to receive crypto currency.
          </p>
        </div>

        {/* Form */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-[350px] border-1 relative border-white rounded-[20px] flex justify-center">
            <div className="flex flex-col items-center pb-4 w-full">
              <div className="mt-4 w-full flex flex-col justify-center">
                <div className="text-white text-center">Enter Amount</div>
                <div className="bg-black w-[160px] mb-2 items-center rounded-lg gap-4 justify-center h-[60px] mx-auto flex">
                  <img
                    className="h-[50px] w-[50px]"
                    src={USDTLOGO}
                    alt="USDT"
                  />
                  <div className="text-white text-[20px]">USDT</div>
                </div>
              </div>
              <input
                type="number"
                value={amount}
                readOnly
                className="h-14 mb-2 bg-transparent rounded-none px-4 border-b-1 border-b-white border-t-0 border-l-0 border-r-0 w-[200px] mt-4 text-white focus:outline-none text-4xl text-center placeholder:text-xl mx-auto"
              />
              <div className="mt-4 w-full flex flex-col justify-center">
                <div className="text-white text-center">Select wallet</div>
                <Combobox
  placeholder="Enter Wallet"
  wallets={
    Array.isArray(wallets)
      ? wallets.map((wallet: any) => ({
          value: wallet.walletType,
          walletID: wallet._id, // ✅ FIXED: Must be walletID (not id)
          label:
            wallet.walletType?.charAt(0).toUpperCase() +
            wallet.walletType.slice(1),
          icon: wallet.walletType ? getWalletLogo(wallet.walletType) : null,
        }))
      : []
  }
  onChange={handleWalletChange}
  onOpenChange={handleComboboxOpen}
/>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 pt-10">
          <Button
            className="w-full h-12 bg-[#6552FE] hover:bg-slate-500 text-white font-semibold rounded-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!walletType || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveFinal;
