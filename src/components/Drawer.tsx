// 🧠 Import & asset code remains unchanged
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  // DrawerDescription,
  DrawerHeader,
  // DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import Binance from "../assets/3495812.svg";
import CoinBase from "../assets/coinbasenewimage.svg";
import { default as FoxImage, default as MetaMask } from "../assets/fox.svg";
import TrustWallet from "../assets/TrustWallet.svg";
import Combobox from "./ComboBox";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

// ✅ Wallet types in correct casing
const wallets = [
  { value: "Binance", label: "Binance", icon: Binance },
  { value: "MetaMask", label: "MetaMask", icon: MetaMask },
  { value: "Coinbase", label: "Coinbase", icon: CoinBase },
  { value: "TrustWallet", label: "TrustWallet", icon: TrustWallet },
];

const DrawerComponent: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, []);

  const handleComboboxOpen = (isOpen: boolean) => {
    if (isOpen) scrollToBottom();
  };

  const handleOpenDialog = async () => {
    try {
      if (!walletAddress || !walletName) {
        toast.error("Wallet ID and type are required");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const formData = new FormData();
      formData.append("walletID", walletAddress);
      formData.append("walletType", walletName);
      if (qrImage) {
        formData.append("qrImage", qrImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/wallet`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setOpenDrawer(false);
        setTimeout(() => setOpenDialog(true), 200);
        setWalletAddress("");
        setWalletName("");
        setQrImage(null);
        setImagePreview(null);
      }
    } catch (error: any) {
      console.error("Error adding wallet:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to add wallet";
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          toast.error("Please login again");
        }
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setQrImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        scrollToBottom();
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#4C4343] rounded-[30px] text-white border-none outline-none">
          <DialogHeader>
            <DialogTitle className="text-center">
              Wallet Status Updated.
            </DialogTitle>
            <DialogDescription className="text-center text-[12px] text-white font-medium">
              Your Wallet account for crypto transaction has been successfully
              added.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-around w-full">
              <Button
                className="rounded-[50px] px-6 min-w-[100px] border-white border-1 bg-[linear-gradient(90deg,rgba(11,4,210,0.43)_0%,rgba(34,66,127,0)_50%)]"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-[50px] px-6 min-w-[100px] border-white border-1 bg-[linear-gradient(90deg,rgba(11,4,210,0.43)_0%,rgba(34,66,127,0)_50%)]"
                onClick={() => setOpenDialog(false)}
              >
                Ok
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <img src={FoxImage} alt="Fox" className="w-[50px] h-[50px]" />
        </DrawerTrigger>
        <DrawerContent className="bg-[#4C4343] border-none font-display max-w-lg w-full mx-auto h-[90vh] flex flex-col">
          <div className="flex-1 overflow-y-auto" ref={contentRef}>
            <div className="mx-auto w-full p-4">
              <DrawerHeader />
              <div className="flex flex-col space-y-2">
                <label className="text-white font-medium text-sm">
                  Enter Wallet ID
                </label>
                <input
                  type="text"
                  placeholder="Wallet ID"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="h-12 px-4 border border-white rounded-xl bg-transparent text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-0.5 mt-4">
                <Separator className="max-w-[150px]" />
                <span className="text-white">And</span>
                <Separator className="max-w-[150px]" />
              </div>

              <div className="space-y-4 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="uploadQr"
                  onChange={handleImageChange}
                />
                <Button
                  className="w-full h-12 bg-[#38AD46] text-white font-semibold rounded-[16px]"
                  onClick={() => document.getElementById("uploadQr")?.click()}
                >
                  Upload Wallet QR Code
                </Button>
                {imagePreview && (
                  <div className="flex flex-col items-center gap-2 p-4 border border-gray-600 rounded-lg">
                    <img
                      src={imagePreview}
                      alt="QR Preview"
                      className="max-w-[200px] h-auto object-contain rounded-lg"
                    />
                    <p className="text-white text-sm">{qrImage?.name}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-4 mb-4">
                <label className="text-white font-medium text-sm">
                  Select a supported wallet type.
                </label>
                <Combobox
                  placeholder="Select Wallet"
                  wallets={wallets}
                  onChange={(value) => setWalletName(value)}
                  onOpenChange={handleComboboxOpen}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-700 bg-[#4C4343]">
            <Button
              className="w-full h-12 bg-[#6552FE] text-white font-semibold rounded-[16px]"
              onClick={handleOpenDialog}
            >
              Submit
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
