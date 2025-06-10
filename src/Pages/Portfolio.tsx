import { useEffect, useState } from "react";
import axios from "axios";
import PortfolioList, { type PortfolioData } from "@/components/PortfolioList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookText, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReferAndEarn from "../assets/ReferAndEarn.svg";

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  // const [totalWallet, setTotalWallet] = useState<number>(0);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_URL}/my-investments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const investments = response.data.investments || [];

        const formattedData = investments.map((item: any) => ({
  id: item._id,
  plan: item.planName,
  date: new Date(item.startDate).toISOString().split("T")[0],
  amount: item.currentAmount,
  roi: item.roi,
  investedAmount: item.investedAmount,
}));


        setPortfolioData(formattedData);

      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-black text-white">
      <div className="absolute h-[180px] inset-x-0 top-0 bg-gradient-to-b from-[#6552FE] via-[#683594] to-[#6B1111] opacity-90 z-10" />

      <div className="relative z-20 pt-6 pl-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm"
        >
          <ArrowLeft size={20} className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* <div className="relative z-20 text-center mt-4">
        <p className="text-gray-200 text-sm">Total invest</p>
        <h1 className="text-3xl font-bold text-white">
          {totalWallet.toLocaleString()}
        </h1>
      </div> */}

      <div className="text-[24px] z-10 mt-[20px] ml-3">Portfolio</div>

      <div className="relative z-20 grid grid-cols-6 px-4 py-3 bg-gray-800 rounded-t-lg mt-4 mx-2">
        <div className="text-gray-300 font-medium text-sm">Plan</div>
        <div className="text-gray-300 font-medium text-sm">Plan ROI</div>
        <div className="text-gray-300 font-medium text-sm text-center">
          Invest Date
        </div>
        <div className="text-gray-300 font-medium text-sm text-right">
          Invest Amount
        </div>
        <div className="text-gray-300 font-medium text-sm text-right">
          Current Amount
        </div>
        <div className="text-gray-300 font-medium text-sm text-right">
          Action
        </div>
      </div>

      <div className="relative z-20 flex-1 mt-0 overflow-y-auto px-2 pb-32">
        <PortfolioList portfolioData={portfolioData} />
      </div>

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
            Invite &<br />Earn
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Portfolio;
