import React from "react";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Users,
  Landmark,
} from "lucide-react";

export type TransactionType =
  | "Income"
  | "Withdrawal"
  | "Paid"
  | "Deposit"
  | "Referral"
  | "Invest"
  | "Partial ROI"
  | "ROI Exit";


export interface TransactionData {
  amount: number;
  balanceAfter: number;
  createdAt: string;
  description: string;
  type: TransactionType;
  userId: string;
  walletID: string;
}

const tagColors: Record<TransactionType, string> = {
  Income: "bg-emerald-100 text-emerald-700",
  Withdrawal: "bg-red-100 text-red-700",
  Paid: "bg-orange-100 text-orange-700",
  Deposit: "bg-blue-100 text-blue-700",
  Referral: "bg-purple-100 text-purple-700",
  Invest: "bg-yellow-100 text-yellow-700",
  "Partial ROI": "bg-green-100 text-green-700",
  "ROI Exit": "bg-green-100 text-green-700",
};

const typeBackgrounds: Record<TransactionType, string> = {
  Income: "bg-emerald-500",
  Withdrawal: "bg-red-500",
  Paid: "bg-orange-500",
  Deposit: "bg-blue-500",
  Referral: "bg-purple-500",
  Invest: "bg-yellow-500",
  "Partial ROI": "bg-green-500",
  "ROI Exit": "bg-green-500",
};

const typeIcons: Record<TransactionType, React.ReactNode> = {
  Income: <ArrowDownLeft size={20} className="text-white" />,
  Withdrawal: <ArrowUpRight size={20} className="text-white" />,
  Paid: <Minus size={20} className="text-white" />,
  Deposit: <Plus size={20} className="text-white" />,
  Referral: <Users size={20} className="text-white" />,
  Invest: <Landmark size={20} className="text-white" />,
  "Partial ROI": <ArrowDownLeft size={20} className="text-white" />,
  "ROI Exit": <ArrowDownLeft size={20} className="text-white" />,
};

interface TransactionCardProps {
  transaction: TransactionData;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    const absAmount = Math.abs(amount);
    return `${
      type === "Withdrawal" || type === "Paid" || type === "Invest" ? "-" : "+"
    }$${absAmount.toFixed(2)}`;
  };

  const getAmountColor = (type: TransactionType) => {
    return type === "Withdrawal" || type === "Paid" || type === "Invest"
      ? "text-red-500"
      : "text-emerald-500";
  };

  const tagColor = tagColors[transaction.type];
  const typeIcon = typeIcons[transaction.type];
  const typeBackground = typeBackgrounds[transaction.type];
  const amountColor = getAmountColor(transaction.type);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start">
        {/* Left side: icon and details */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${typeBackground} flex items-center justify-center shadow-md`}
          >
            {typeIcon}
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColor}`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Wallet Id: {transaction.walletID.slice(0, 8)}...
            </div>
          </div>
        </div>

        {/* Right side: date and amount */}
        <div className="flex flex-col items-end justify-between h-full">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
            <Calendar size={12} />
            <span>{formatDate(transaction.createdAt)}</span>
          </div>
          <div className={`text-sm font-bold ${amountColor}`}>
            {formatAmount(transaction.amount, transaction.type)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Balance:
            <span className="ml-1 text-gray-800 dark:text-gray-300 font-medium">
              ${transaction.balanceAfter.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
