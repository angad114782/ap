import React from "react";
import { Calendar } from "lucide-react";
import type { PortfolioData } from "./PortfolioList";

export type PortfolioType = "Gold" | "Platinum" | "Master" | "Diamond";

const tagColors: Record<PortfolioType, string> = {
  Gold: "bg-yellow-400",
  Platinum: "bg-blue-500",
  Master: "bg-purple-600",
  Diamond: "bg-gray-300 text-black",
};

const amountColors = {
  positive: "bg-green-500",
  negative: "bg-red-600",
};

const PortfolioCard: React.FC<PortfolioData> = ({ plan, date, amount }) => {
  const isPositive = amount >= 0;
  const tagColor = tagColors[plan as PortfolioType];
  const amountColor = isPositive
    ? amountColors.positive
    : amountColors.negative;

  return (
    <div className="grid grid-cols-3 items-center px-4 py-3 bg-transparent border-b border-white/10">
      {/* Plan Column */}
      <div className="flex items-center justify-start">
        <span className={`px-2 py-1 rounded-full text-sm ${tagColor}`}>
          {plan}
        </span>
      </div>

      {/* Date Column */}
      <div className="flex items-center justify-center text-white text-sm">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>

      {/* Amount Column */}
      <div className="flex items-center justify-end">
        <span
          className={`text-white font-medium px-3 py-1 rounded-[10px] text-sm ${amountColor}`}
        >
          {isPositive ? `${amount}` : amount}
        </span>
      </div>
    </div>
  );
};

export default PortfolioCard;
