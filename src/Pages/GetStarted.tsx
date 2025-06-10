import { Button } from "@/components/ui/button";
import NewLogoGetStarted from "../assets/new-logo-getstarted.svg";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full bg-[#070707] px-3  py-8">
      {/* logo at top */}
      <div className="flex-none flex justify-center mt-12">
        <img
          src={NewLogoGetStarted}
          alt="getstarted Logo"
          className="w-[280px] h-[280px] rounded-[12px]"
        />
      </div>

      {/* text in middle */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-white font-semibold text-[32px] leading-tight">
          Jump start your
          <br /> crypto portfolio
        </h1>
        <p className="mt-2 text-[14px] leading-[150%] text-[#F7F7F7]">
          Take your investment portfolio
          <br />
          to next level
        </p>
      </div>

      {/* button at bottom */}
      <div className="flex-none">
        <Button
          className="w-full h-[50px] bg-[#6552FE] text-white hover:bg-slate-500 font-semibold text-[16px] leading-[24px] rounded-[16px]"
          onClick={() => navigate("/login-register")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default GetStarted;
