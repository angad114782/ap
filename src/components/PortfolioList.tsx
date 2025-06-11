// components/PortfolioList.tsx
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export type PortfolioData = {
  id: string;
  plan: string;
  date: string; // ISO date string
  amount: number; // current compounded amount
  roi: number;
  investedAmount: number;
};

const PortfolioList = ({
  portfolioData,
}: {
  portfolioData: PortfolioData[];
}) => {

const handleExit = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_URL}/investments/${id}/withdraw-roi`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.json();

    console.log("🚨 Exit Response:", result); // ✅ LOG

    if (
      res.ok ||
      result.message?.toLowerCase().includes("investment exited") ||
      result.message?.toLowerCase().includes("roi credited")
    ) {
      toast.success(result.message || "Investment exited successfully");
      window.location.href = "/main-screen";
    } else {
      toast.error(result.message || "Failed to exit investment");
    }
  } catch (error) {
    console.error("❌ Exit API Error:", error);
    toast.error("Exit failed");
  }
};


  return (
    <div className="space-y-2">
      {portfolioData.map((item) => {
        const start = new Date(item.date);
        const now = new Date();
        const daysPassed = Math.floor(
          (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysLeft = 60 - daysPassed;

        return (
          <div
            key={item.id}
            className="grid grid-cols-6 items-center px-4 py-3 bg-gray-900 rounded-lg"
          >
            <div className="text-sm">{item.plan}</div>
            <div className="text-sm text-center">{item.roi}%</div>
            <div className="text-sm text-center">{item.date}</div>

            <div className="text-sm text-right text-green-400">
              {item.investedAmount.toLocaleString()}
            </div>
            <div className="text-sm text-right text-green-500 font-semibold">
              {item.amount.toLocaleString()}
            </div>

            <div className="flex justify-end">
              {daysPassed >= 60 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                  onClick={() => handleExit(item.id)}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Exit
                </Button>
              ) : (
                <span className="text-xs text-gray-400">{daysLeft}d left</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioList;
