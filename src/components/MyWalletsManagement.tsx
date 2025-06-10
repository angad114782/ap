import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Wallet, Check } from "lucide-react";
import { toast } from "sonner";

import Binance from "../assets/binance.svg";
import MetaMask from "../assets/fox.svg";
import CoinBase from "../assets/Coinbase.svg";
import TrustWallet from "../assets/TrustWallet.svg";
import SendDollar from "../assets/Send Dollar.svg";

// ✅ Updated interface to match backend
interface WalletData {
  id: string;
  walletName: string;
  walletAddress: string;
  isActive: boolean;
  qrCodeUrl?: string;
}

export const MyWalletsManagement = () => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userWallets, setUserWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUserWallets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_URL}/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const walletsArray = response.data?.data;
if (!Array.isArray(walletsArray)) {
  toast.error("Invalid wallet response");
  return;
}

const formattedWallets = walletsArray.map((wallet: any) => ({

        id: wallet._id,
        walletName: wallet.walletType || "unknown", 
        walletAddress: wallet.walletID,
        isActive: wallet.isActive,
        qrCodeUrl: wallet.qrCodeUrl,
      }));

      setUserWallets(formattedWallets);

      const activeWallet = formattedWallets.find((w) => w.isActive);
      if (activeWallet) {
        setSelectedWallet(activeWallet.id);
      } else if (formattedWallets.length > 0) {
        setSelectedWallet(formattedWallets[0].id);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to fetch wallets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openDrawer) {
      fetchUserWallets();
    }
  }, [openDrawer]);

  const handleWalletSelection = async (walletId: string) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      setSelectedWallet(walletId);
      setUserWallets((prevWallets) =>
        prevWallets.map((wallet) => ({
          ...wallet,
          isActive: wallet.id === walletId,
        }))
      );

      await axios.put(
        `${import.meta.env.VITE_URL}/wallet/set-active/${walletId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Default wallet updated successfully");
    } catch (error) {
      console.error("Error setting default wallet:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update default wallet";
        toast.error(errorMessage);
      }
      await fetchUserWallets();
    } finally {
      setIsUpdating(false);
    }
  };

const getWalletIcon = (name: string | undefined) => {
  const safeName = name?.toLowerCase?.() || "";
  switch (safeName) {
    case "binance":
      return Binance;
    case "metamask":
      return MetaMask;
    case "coinbase":
      return CoinBase;
    case "trustwallet":
      return TrustWallet;
    default:
      return TrustWallet;
  }
};


  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center gap-3 cursor-pointer">
          <button>
            <img src={SendDollar} alt="Send" className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-xs sm:text-sm">Wallet</span>
          </button>
        </div>
      </DrawerTrigger>

      <DrawerContent className="bg-[#1a1a1a] border-gray-800 text-white font-display max-w-lg w-full mx-auto h-[70vh]">
        <DrawerHeader className="border-b border-gray-800 sticky top-0 bg-[#1a1a1a] z-10">
          <DrawerTitle className="text-xl text-white font-semibold">
            My Wallets
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6552FE] mx-auto mb-2"></div>
                <p className="text-gray-400">Loading wallets...</p>
              </div>
            </div>
          ) : userWallets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <Wallet className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    No wallets found
                  </p>
                  <p className="text-gray-400 mb-6">
                    Add your first wallet to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Select a wallet to set as default ({userWallets.length} wallet
                  {userWallets.length !== 1 ? "s" : ""} available)
                </p>
              </div>

              {userWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedWallet === wallet.id
                      ? "border-[#6552FE] bg-[#6552FE]/10 shadow-lg"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                  } ${isUpdating ? "opacity-70 pointer-events-none" : ""}`}
                  onClick={() => handleWalletSelection(wallet.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={getWalletIcon(wallet.walletName)}
                        alt={wallet.walletName}
                        className="w-12 h-12 rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold capitalize text-lg text-white truncate">
                          {wallet.walletName}
                        </p>
                        {wallet.isActive && (
                          <span className="px-2 py-1 text-xs bg-[#6552FE] text-white rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate font-mono">
                        {wallet.walletAddress}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedWallet === wallet.id
                            ? "border-[#6552FE] bg-[#6552FE] shadow-lg"
                            : "border-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {selectedWallet === wallet.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isUpdating && selectedWallet === wallet.id && (
                    <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6552FE]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
