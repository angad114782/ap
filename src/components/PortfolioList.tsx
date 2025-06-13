// components/PortfolioList.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleExit = async (id: string, daysLeft: number) => {
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
        toast.warning(`${daysLeft}d left`);
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
            className="grid grid-cols-6 items-center px-4 py-3 bg-gray-900 font-display rounded-lg"
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
              {/* {daysPassed >= 60 ? ( */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <EllipsisVerticalIcon className="h-4 w-4 mr-1  fill-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-black text-white outline-none border-none "
                  align="end"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      if (daysPassed >= 60) {
                        handleExit(item.id, daysLeft);
                      } else {
                        toast.warning(`⏳ You can exit after ${daysLeft} days`);
                      }
                    }}
                  >
                    Full Withdrawal
                  </DropdownMenuItem>

                  <DropdownMenuItem
  onClick={() =>
    navigate("/partial-withdraw", {
      state: {
        availableAmount: item.amount - item.investedAmount,
        planId: item.id,
        investedAmount: item.investedAmount,
        currentAmount: item.amount,
      },
    })
  }
>
  Partial Withdrawal
</DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
              {/* ) : (
                <span className="text-xs text-gray-400">{daysLeft}d left</span>
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioList;
