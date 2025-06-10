import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, BookText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/TransactionList";
import ReceiptBg from "../assets/ReceiptBg.tsx.svg";
import ReferAndEarn from "../assets/ReferAndEarn.svg";

import type { TransactionData } from "@/components/TransactionCard";

const Passbook = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(transactions);

  const fetchPassbookData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_URL}/passbook`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data, "passbook");

      // const formattedTransactions: TransactionData[] =
      //   response.data.transactions.map((tx: any) => {
      //     const walletType = tx.walletType?.toLowerCase() || "binance";
      //     return {
      //       id: tx._id,
      //       username: tx.walletID || "Unknown",
      //       time: new Date(tx.createdAt).toLocaleString(),
      //       type: tx.type,
      //       amount: tx.amount,
      //       walletType,
      //       walletImage: walletTypeImages[walletType] || BinanceImage,
      //     };
      //   });

      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching passbook:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassbookData();
  }, []);

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-black text-white">
      {/* Fixed Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ReceiptBg})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute h-[180px] inset-x-0 top-0 bg-gradient-to-b from-[#6552FE] via-[#683594] to-[#6B1111] opacity-90 z-10" />

      {/* Top Bar */}
      <div className="relative z-20 pt-6 pl-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Header with refresh button */}
      <div className="text-[24px] z-10 mt-[80px] ml-3 flex justify-between items-center pr-4">
        <span>Transactions</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchPassbookData}
          disabled={isLoading}
          className="text-white hover:text-gray-200"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20 flex-1 mt-[20px] overflow-y-auto px-2 pb-32">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 bg-gray-800/50 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No transactions found</p>
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-lg w-full bg-[#171717] py-4 flex justify-around items-center z-30 rounded-t-xl shadow-inner">
        <Button
          className="flex gap-2 items-center text-white"
          onClick={() => navigate("/main-screen")}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button
          onClick={() => navigate("/passbook")}
          className="flex gap-2 items-center text-white"
        >
          <BookText className="w-5 h-5" />
          <span className="text-xs mt-1">Passbook</span>
        </Button>
        <Button
          onClick={() => navigate("/invite-and-earn")}
          className="flex gap-2 items-center "
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

export default Passbook;
