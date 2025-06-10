import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OnboardingProps {
  mainLogo: string;
  smallLogo: string;
  text: string;
  to: string;
}

const Onboarding = ({ mainLogo, smallLogo, text, to }: OnboardingProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full bg-[#070707] px-3 py-8">
      {/* top: main image */}
      <div className="flex-none flex justify-center pt-8">
        <img
          src={mainLogo}
          alt="Trust Logo"
          className="w-full h-[280px] rounded-[12px]"
        />
      </div>

      {/* middle: text + small slider */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <img
          src={smallLogo}
          alt="progress slider"
          className={`w-full h-[8px] rounded-[12px] ${
            text.includes("Anywhere") ? "rotate-180" : ""
          }`}
        />
        <div className="text-center font-display font-semibold text-[34px] leading-[41px] text-[#F7F7F7] px-4">
          {text}
        </div>
      </div>

      {/* bottom: next button */}
      <div className="flex-none">
        <Button
          className="w-full h-[50px] hover:bg-slate-500 bg-[#6552FE] text-white font-semibold text-[16px] leading-[24px] rounded-[16px]"
          onClick={() => navigate(to)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
