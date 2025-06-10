// components/TransactionList.tsx
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export type PortfolioData = {
  id: string;
  plan: string;
  date: string;
  amount: number; // this is currentAmount
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
      console.log("User Id:", id);
      // Add your exit logic here
      toast.success("Investment exited successfully");
    } catch (error) {
      toast.error("Failed to exit investment");
    }
  };

  return (
    <div className="space-y-2">
      {portfolioData.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-6 items-center px-4 py-3 bg-gray-900 rounded-lg"
        >
          <div className="text-sm">{item.plan}</div>
          <div className="text-sm text-center">{item.roi}%</div>
          <div className="text-sm text-center">{item.date}</div>
          <div
            className={`text-sm text-right ${
              item.investedAmount >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {item.investedAmount.toLocaleString()}
          </div>
          <div
            className={`text-sm text-right ${
              item.amount >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {item.amount.toLocaleString()}
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
              onClick={() => handleExit(item.id)}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioList;
