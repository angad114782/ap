import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SelectComponent from "@/components/Select";
import USDTLOGO from "../assets/usdt logo.svg";
import { investmentService } from "@/services/investmentService";

// Define the Plan interface
interface Plan {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
  roi: number;
  durationDays: number;
  // Add any other properties as needed
}

const InvestmentPlan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchPlans();
  }, []);

const fetchPlans = async () => {
  try {
    const plans = await investmentService.fetchPlans();

    // ✅ Only active plans
    const activePlans = plans.filter((plan: Plan) => plan.isActive);

    setPlans(activePlans);

    // ✅ Set default selected only from active plans
    if (activePlans.length > 0) {
      setSelectedPlan(activePlans[0]);
      setAmount(activePlans[0].minAmount);
    }

    setLoading(false);
  } catch (error: any) {
    toast.error("Failed to fetch investment plans");
    setLoading(false);
  }
};


  const validateAmount = (
    value: number,
    plan: Plan = selectedPlan!
  ): boolean => {
    if (!plan) return false;

    if (value < plan.minAmount) {
      setError(
        `Amount must be at least ${plan.minAmount.toLocaleString()} USD`
      );
      return false;
    }

    if (value > plan.maxAmount) {
      setError(`Amount must not exceed ${plan.maxAmount.toLocaleString()} USD`);
      return false;
    }

    setError("");
    return true;
  };

  const handlePlanChange = (plan: any): void => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount);
    setError("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputVal = e.target.value;

    if (inputVal === "") {
      setAmount(0);
      setError(
        `Amount must be at least ${selectedPlan?.minAmount.toLocaleString()} USD`
      );
      return;
    }

    const val = Number(inputVal);
    if (isNaN(val)) return;

    setAmount(val);
    validateAmount(val);
  };

  const handleContinue = () => {
    if (!selectedPlan || !validateAmount(amount)) {
      toast.error("Please select a plan and enter a valid amount");
      return;
    }

    // Navigate to final screen with selected plan and amount
    navigate("/investment-plan-final", {
      state: {
        selectedPlan,
        amount,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center text-white">
        No active investment plans available
      </div>
    );
  }

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
        <p className="text-sm text-[#D1D1D1] mt-1">
          Select your desired investment plan and crypto currency to grow your
          business.
        </p>
      </div>

      {/* Currency Section */}
      <div className="bg-[#3A3232] py-4 px-8 rounded-2xl h-[142px] mb-5">
        <p className="text-white font-semibold">Supported Currency</p>
        <div className="flex justify-center items-center h-full">
          <div className="bg-black w-[160px] mb-2 items-center rounded-lg gap-4 justify-center h-[60px] mx-auto flex">
            <img className="h-[50px] w-[50px]" src={USDTLOGO} alt="" />
            <div className="text-white text-[20px]">USDT</div>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="bg-[#3A3232] p-4 rounded-2xl h-[142px] mb-5">
        <p className="text-white font-semibold mb-2">Investment Plan</p>
        <SelectComponent
          plans={plans}
          selectedPlan={selectedPlan!}
          onPlanChange={handlePlanChange}
        />
      </div>

      {/* Amount Input */}
      <div className="bg-[#3A3232] h-auto p-4 rounded-2xl">
        <p className="text-white font-semibold mb-2">Deposit Amount</p>
        <div
          className={`flex items-center border rounded-xl px-4 py-3 ${
            error ? "border-red-500" : "border-white"
          }`}
        >
          <input
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={handleAmountChange}
            className="bg-transparent text-white outline-none flex-1"
            placeholder={`Min. ${selectedPlan?.minAmount.toLocaleString()}`}
          />
          <span className="text-white font-semibold">USD</span>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

        {/* Min/Max Display */}
        <div className="flex justify-between text-sm text-white mt-2">
          <span>
            Min. Amount:{" "}
            <span className="text-green-500 font-semibold">
              {selectedPlan?.minAmount.toLocaleString()}
            </span>
          </span>
          <span>
            Max. Amount:{" "}
            <span className="text-green-500 font-semibold">
              {selectedPlan?.maxAmount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          className={`w-full text-white text-base py-6 rounded-2xl ${
            error || !selectedPlan || amount < selectedPlan.minAmount
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#7553FF]"
          }`}
          disabled={!!error || !selectedPlan || amount < selectedPlan.minAmount}
          onClick={handleContinue} // Changed from handleInvestment to handleContinue
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InvestmentPlan;
