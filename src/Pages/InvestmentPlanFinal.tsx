import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import USDTLogo from "../assets/usdt logo.svg";
import { investmentService } from "@/services/investmentService";

import { toast } from "sonner";

interface Plan {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  durationDays: number;
}

const InvestmentPlanFinal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Get passed data from previous screen
  const { selectedPlan, amount } = location.state as {
    selectedPlan: Plan;
    amount: number;
  };

  // Validate we have required data
  if (!selectedPlan || !amount) {
    navigate("/investment-plan");
    return null;
  }

  const handleInvestment = async () => {
    setIsLoading(true);
    try {
      await investmentService.createInvestment(selectedPlan._id, amount);

      toast.success("Investment created successfully!");

      setTimeout(() => {
        navigate("/main-screen", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("Investment error:", error);
      if (error.message.includes("login")) {
        toast.error("Session expired. Please login again");
        setTimeout(() => navigate("/login-register"), 1500);
      } else {
        toast.error(error?.message || "Failed to create investment");
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#070707] px-4 pt-6 pb-28 relative">
      {/* Back Button and Line */}
      <div className="flex flex-col gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className="h-8 w-8 text-white" />
        </button>
        <div className="border-t border-white border-[3px] w-full" />
      </div>

      {/* Header */}
      <div className="text-start mb-1 sm:mb-6">
        <h2 className="font-semibold text-white text-2xl">Investment Plan</h2>
      </div>
      {/* Investment Amount Section */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8 relative">
        {/* Plan Name Box */}
        <div className="absolute -top-3 right-4 bg-[#7553FF] px-4 py-1 rounded-xl">
          <span className="text-white font-medium text-sm">
            {selectedPlan.name}
          </span>
        </div>

        <h2 className="text-white text-xl font-medium mb-6">
          Enter Investment Amount
        </h2>

        {/* Min/Max Display */}
        <div className="bg-green-600 rounded-xl p-4 mb-4 flex justify-between items-center">
          <div className="text-left">
            <div className="text-sm text-green-100">Minimum</div>
            <div className="text-lg font-bold">
              {selectedPlan.minAmount.toLocaleString()}
            </div>
          </div>

          <div className="bg-black rounded-lg p-3">
            <TrendingUp size={20} className="text-white" />
          </div>

          <div className="text-right">
            <div className="text-sm text-green-100">Maximum</div>
            <div className="text-lg font-bold">
              {selectedPlan.maxAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="bg-gray-900 rounded-xl items-center justify-center p-4 flex  gap-3">
          <img src={USDTLogo} alt="" />
          <span className="text-white font-medium">USDT</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="text-center mb-12">
        <input
          readOnly
          type="text"
          value={amount}
          // onChange={handleAmountChange}
          className="bg-transparent text-white text-3xl font-light text-center w-full border-none outline-none border-b-2 border-gray-600 pb-2"
          placeholder="0"
        />
      </div>
      {/* </div> */}

      {/* Continue Button */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          className={`w-full text-white text-base py-6 rounded-2xl ${
            isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[#7553FF]"
          }`}
          disabled={isLoading}
          onClick={handleInvestment}
        >
          {isLoading ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default InvestmentPlanFinal;
