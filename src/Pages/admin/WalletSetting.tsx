import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, Copy, LucideDelete, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Binance from "@/assets/3495812.svg";
import MetaMask from "@/assets/fox.svg";
import Coinbase from "@/assets/Coinbase.svg";
import TrustWallet from "@/assets/TrustWallet.svg";

// Add these types at the top of the file
type WalletData = {
  _id: string;
  walletID: string;
  walletType: "binance | metamask | coinbase | trustwallet";
  balance: number;
  isActive: boolean;
  qrImage?: string;
  userId: string;
};

// Add Wallet Dialog Component
const AddWalletDialog = ({ onWalletAdd }: { onWalletAdd: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    walletID: "",
    walletType: "",
    balance: "0",
    qrCode: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.walletID || !formData.walletType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.balance && isNaN(Number(formData.balance))) {
      toast.error("Balance must be a valid number");
      return;
    }

    if (isSubmitting) {
      toast.error("Please wait, submission in progress");
      return;
    }
    // More flexible validation for text input
    const normalizedWalletType = formData.walletType.toLowerCase().trim();
    if (
      !["binance", "metamask", "coinbase", "trustwallet"].includes(
        normalizedWalletType
      )
    ) {
      toast.error(
        "Please enter a valid wallet type (binance, metamask, coinbase, trustwallet)"
      );
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("walletID", formData.walletID);
      formDataToSend.append("walletType", normalizedWalletType);
      formDataToSend.append("balance", formData.balance);
      if (previewUrl) {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        formDataToSend.append("qrImage", blob, "qr-code.png");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/wallet`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Wallet added successfully!");
        onWalletAdd(); // Refresh the wallet list
        setOpen(false);
        // Reset form
        setFormData({
          walletID: "",
          walletType: "",
          balance: "0",
          qrCode: "",
        });
        setPreviewUrl("");
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
      toast.error("Failed to add wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFormData((prev) => ({ ...prev, qrCode: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Wallet</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="walletType">Wallet Type</Label>
            <Input
              id="walletType"
              value={formData.walletType}
              onChange={(e) =>
                setFormData({ ...formData, walletType: e.target.value })
              }
              placeholder="Enter wallet type"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletID">Wallet ID Token Type BEP-20</Label>
            <Input
              id="walletID"
              value={formData.walletID}
              onChange={(e) =>
                setFormData({ ...formData, walletID: e.target.value })
              }
              placeholder="Enter wallet address"
            />
          </div>

          {/* Add QR Code upload field */}
          <div className="space-y-2">
            <Label htmlFor="qrCode">QR Code</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="qrCode"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {previewUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={previewUrl}
                    alt="QR Code Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Wallet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Change from function to component
export const WalletSetting = () => {
  // Add this state for managing copied wallets
  const [copiedWallets, setCopiedWallets] = useState<{
    [key: string]: boolean;
  }>({});

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log("Wallets:", wallets);
  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_URL}/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    setWallets(response.data.data); // ✅ Corrected to match API
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to fetch wallets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleCopy = async (walletId: string) => {
    try {
      await navigator.clipboard.writeText(walletId);
      setCopiedWallets((prev) => ({ ...prev, [walletId]: true }));
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedWallets((prev) => ({ ...prev, [walletId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_URL}/wallet/${walletId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response:", response);
      if (response.status !== 200) {
        throw new Error("Failed to delete wallet");
      }
      toast.success("Wallet deleted successfully!");
      fetchWallets(); // Refresh the wallet list
    } catch (error) {
      console.error("Error deleting wallet:", error);
      toast.error("Failed to delete wallet");
    }
  };

  const getWalletIcon = (walletType: string) => {
    switch (walletType) {
      case "binance":
        return Binance;
      case "metamask":
        return MetaMask;
      case "coinbase":
        return Coinbase;
      case "trustwallet":
        return TrustWallet;
      default:
        return null;
    }
  };
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Wallet Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your crypto wallets and settings
          </p>
        </div>
        <AddWalletDialog onWalletAdd={fetchWallets} />
      </div>

      {/* Updated wallet cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {wallets.map((wallet) => (
            <Card
              key={wallet._id}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      <img
                        src={getWalletIcon(wallet.walletType) || ""}
                        alt={`${wallet.walletType} icon`}
                        className="h-8 w-8"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-base text-gray-600">
                        {wallet.walletType}
                      </h3>
                      {/* <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                        ${wallet.balance.toLocaleString()}
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* Wallet Details with QR Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Wallet ID Token Type BEP-20</span>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-100">
                        <span className="text-sm font-medium truncate">
                          {wallet.walletID}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0 ml-auto shrink-0 transition-all",
                                  copiedWallets[wallet.walletID] &&
                                    "text-green-500"
                                )}
                                onClick={() => handleCopy(wallet.walletID)}
                              >
                                {copiedWallets[wallet.walletID] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {copiedWallets[wallet.walletID]
                                  ? "Copied!"
                                  : "Copy"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  {wallet.qrImage && (
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-full aspect-square max-w-[150px]">
                        <img
                          src={`${import.meta.env.VITE_URL.slice(0, -4)}/${
                            wallet.qrImage
                          }`}
                          alt={`${wallet.walletType} QR Code`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transfer Button */}
                <Button
                  className="w-full h-9 font-medium bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteWallet(wallet._id)}
                >
                  <LucideDelete className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
