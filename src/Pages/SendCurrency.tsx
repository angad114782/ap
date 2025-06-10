// File: src/pages/SendCurrency.tsx

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User2Icon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import USDTLOGO from "../assets/usdt logo.svg";
// import Combobox from "@/components/ComboBox";
import Combobox from "@/components/ComboBox";
import { toast } from "sonner";
import Binance from "../assets/3495812.svg";
import CoinBase from "../assets/Coinbase.svg";
import MetaMask from "../assets/fox.svg";
import TrustWallet from "../assets/TrustWallet.svg";
import { sendCurrencyService } from "@/services/sendCurrencyService";
import axios from "axios";

type AdminWallet = {
  value: string;
  label: string;
  icon: string;
  qrImage?: string; // Optional if not always available
  balance: number;
  adminName: string;
};

type UserWallet = {
  walletType: string;
  isActive: boolean;
  walletID: string;
  balance: number;
};

const SendCurrency = () => {
  const navigate = useNavigate();
  const [selectedWallet, setSelectedWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [walletID, setWalletID] = useState("");
  const [showWalletIDInput, setShowWalletIDInput] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [userData, setUserData] = useState<{
    wallets: UserWallet[];
    name?: string;
    profilePic?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login-register");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Handle profile picture URL
        const userData = response.data;
        if (userData.profilePic) {
          userData.profilePic = `${import.meta.env.VITE_URL.slice(0, -4)}${
            userData.profilePic
          }`;
        }

        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Please login again");
          navigate("/login-register");
        } else {
          toast.error("Failed to load user data");
        }
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const backnavigation = () => {
    if (showWalletIDInput) {
      setShowWalletIDInput(false);
    } else {
      navigate(-1);
    }
  };

  const validateFirstStep = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!selectedWallet) {
      toast.error("Please select a wallet");
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!walletID) {
      toast.error("Please enter wallet ID");
      return false;
    }
    if (!screenshot) {
      toast.error("Please upload a screenshot");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateFirstStep()) {
      setShowWalletIDInput(true);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    if (!validateFirstStep() || !validateSecondStep()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("amount", amount);

    // Get the wallet TYPE (label) instead of wallet ID
    const walletType =
      adminWallets.find((w) => w.value === selectedWallet)?.label || "";
    formData.append("wallet", walletType); // Use wallet type here

    formData.append("walletID", walletID);
    // Fix: Access the first element of the array since userActiveWallet is an array
    

  formData.append("userActiveWalletID", "none");
formData.append("userActiveWalletType", "none");


    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    try {
      const response = await sendCurrencyService.createSendRequest(formData);
      const selectedWalletData = adminWallets.find(
        (w) => w.value === selectedWallet
      );
      if (!selectedWalletData) {
        throw new Error("Selected wallet not found");
      }
      // Check if the response contains the expected data
      if (!response || !response.data || !response.data._id) {
        throw new Error("Invalid response from server");
      }
      const walletID = response.data.walletID || selectedWalletData.value;
      // Navigate to the transfer receipt page with the necessary data
      toast.success("Transfer request submitted successfully");
      navigate("/transfer-receipt", {
        state: {
          amount: amount,
          walletQr: selectedWalletData?.icon || "",
          walletType: selectedWalletData?.label || "",
          walletID: walletID,
          transactionId: response.data._id,
        },
      });
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(error instanceof Error ? error.message : "Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setScreenshot(file);
      // Clean up previous preview URL
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchAdminWallets = async () => {
    try {
      setIsLoadingWallets(true);
      const wallets = await sendCurrencyService.getAdminWallets();

      const formattedWallets = wallets.map((wallet: any) => ({
        value: wallet.walletID,
        label: wallet.walletType,
        qrImage: wallet.qrImage || "", // Keep the original path from API
        icon: getWalletIcon(wallet.walletType),
        balance: wallet.balance,
        adminName: wallet.adminName,
      }));

      setAdminWallets(formattedWallets);
    } catch (error) {
      console.error("Error fetching admin wallets:", error);
      toast.error("Failed to fetch admin wallets");
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const getWalletIcon = (type: string) => {
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
        return TrustWallet;
    }
  };

  // Function to get the selected wallet's QR image URL
  const getSelectedWalletQR = () => {
    const selectedWalletData = adminWallets.find(
      (w) => w.value === selectedWallet
    );
    if (selectedWalletData?.qrImage) {
      // Convert the file path to a proper URL
      // Replace backslashes with forward slashes and construct full URL
      const cleanPath = selectedWalletData.qrImage.replace(/\\/g, "/");
      return `${import.meta.env.VITE_URL.slice(0, -4)}/${cleanPath}`;
    }
    return null;
  };

  useEffect(() => {
    fetchAdminWallets();
  }, []);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] py-2 overflow-y-auto overflow-x-hidden px-3">
      {isLoading ? (
        <div>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div className="flex flex-col gap-1 mb-3">
            <button
              onClick={backnavigation}
              className="flex items-center gap-2 text-white text-sm"
            >
              <ArrowLeft size={20} className="h-8 w-8 m-1 text-white" />
            </button>
            <div className="border-t border-white border-4 w-full" />
          </div>
          <div className="flex flex-col gap-1 w-full flex-grow">
            <div className="flex-none text-start">
              <h2 className="mt-1 font-medium text-[#F7F7F7] text-[22px] leading-tight">
                Enter Amount
              </h2>
              <p className="text-[#F7F7F7] text-sm mt-1">
                Enter amount of crypto currency to send.
              </p>
            </div>

            <div className="mt-1 flex justify-center">
              <div className="w-full max-w-[350px] pb-2 border-1 relative border-white rounded-[20px] flex justify-center">
                <div className="flex flex-col items-center w-full">
                  {userData?.profilePic ? (
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="h-[80px] w-[80px] rounded-full border-2 border-white mt-2 object-cover"
                    />
                  ) : (
                    <User2Icon className="h-[80px] w-[80px] rounded-full border-2 border-white mt-2" />
                  )}
                  <div className="text-white text-[15px] text-center mt-2">
                    {userData?.name || "User Name"}
                  </div>
                  <div className="mt-2 w-full flex justify-center">
                    <div className="bg-black w-[160px]  items-center rounded-lg gap-4 justify-center h-[50px] mx-auto flex">
                      <img
                        className="h-[40px] w-[40px]"
                        src={USDTLOGO}
                        alt="USDT"
                      />
                      <div className="text-white text-[15px]">USDT</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10 mb-2 bg-transparent rounded-none px-4 border-b-1 border-b-white border-t-0 border-l-0 border-r-0 w-[250px] mt-1 text-white focus:outline-none text-xl text-center placeholder:text-xl mx-auto"
                    placeholder="Enter amount"
                  />
                  <div className="mt-4 w-full flex flex-col justify-center">
                    <div className="text-white text-center">Select wallet</div>
                    {isLoadingWallets ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <Combobox
                        placeholder="Select wallet"
                        wallets={adminWallets}
                        onChange={(value) => {
                          setSelectedWallet(value);
                          const selectedWallet = adminWallets.find(
                            (w) => w.value === value
                          );
                          if (selectedWallet) {
                            setWalletID(selectedWallet.value);
                          }
                        }}
                        onOpenChange={(open) => {
                          if (!open) {
                            setShowWalletIDInput(false);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showWalletIDInput ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-white font-medium text-sm">
                  Wallet ID Token Type BEP-20
                </label>
                <input
                  value={walletID}
                  onChange={(e) => setWalletID(e.target.value)}
                  type="text"
                  readOnly
                  placeholder="Enter wallet Id"
                  className="h-10 px-4 border border-white rounded-xl bg-transparent text-white placeholder:text-[#6B6B6B] outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-1">
                <Separator className="w-1/4" />
                <span className="text-white">OR</span>
                <Separator className="w-1/4" />
              </div>

              {/* QR Code Display Section */}
              <div className="flex flex-col items-center gap-2">
                {getSelectedWalletQR() ? (
                  <div className="flex flex-col items-center">
                    <p className="text-white text-sm mb-2">
                      Scan QR Code to Pay
                    </p>
                    <img
                      src={getSelectedWalletQR()!}
                      alt="Wallet QR Code"
                      className="w-48 h-48 border-2 border-white rounded-lg bg-white p-2"
                      onError={(e) => {
                        console.error(
                          "QR image failed to load:",
                          getSelectedWalletQR()
                        );
                        // Hide the image if it fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 border-2 border-white rounded-lg flex items-center justify-center">
                    <p className="text-white text-sm text-center">
                      QR Code not available
                    </p>
                  </div>
                )}
              </div>

              {preview && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-white text-sm">Payment Screenshot</p>
                  <img
                    src={preview}
                    alt="Screenshot Preview"
                    className="max-h-48 rounded-lg border border-white"
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-10 hover:bg-slate-500 bg-[#38AD46] text-white font-semibold rounded-[12px]"
                  onClick={triggerFileSelect}
                >
                  Add Screenshot
                </Button>

                <Button
                  disabled={isSubmitting}
                  className="w-full h-10 hover:bg-slate-500 bg-[#6552FE] text-white font-semibold rounded-[12px]"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-10">
              <Button
                className="w-full h-10 bg-[#6552FE] hover:bg-slate-500 text-white font-semibold rounded-[12px]"
                disabled={!amount || parseFloat(amount) <= 0 || !selectedWallet}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SendCurrency;
