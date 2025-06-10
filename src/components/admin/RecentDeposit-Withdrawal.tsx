import React, { useState } from "react";
import USDT from "@/assets/usdt logo.svg";
import { Badge } from "../ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface RecentDepositWithdrawalData {
  id: string;
  user: string;
  phone: string;
  amount: string;
}
interface RecentInvestmentsProps {
  data?: RecentDepositWithdrawalData[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}
const RecentDepositWithdrawal = ({
  data = [],
  title = "Recent Investment",
  showViewAll = true,
  onViewAll = () => {},
}: RecentInvestmentsProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recentDepositWithdrawal = data.length > 0 ? data : [];

  const getUserAvatar = () => (
    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs">👤</span>
    </div>
  );
  const getUsdtlogo = () => (
    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs">
        {" "}
        <img src={USDT} className="h-6 w-6" alt="" />
      </span>
    </div>
  );

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
        {/* Header */}
        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md"
            >
              View All
            </button>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="p-4">
          <div className="space-y-4">
            {recentDepositWithdrawal.map((data) => (
              <div
                key={data.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {title === "Recent Withdrawals" ? (
                      <ArrowDownLeft className="h-8 w-8 rounded-full text-white bg-[#FF0000] p-1.5" />
                    ) : (
                      <ArrowUpRight className="h-8 w-8 rounded-full text-white bg-[#1ACC1A] p-1.5" />
                    )}
                    <div className="flex items-center gap-2">
                      <img src={USDT} className="h-8 w-8" alt="" />
                      <div className="font-semibold">{data.amount} </div>
                      {/* <div className="text-sm text-gray-500">{data.id}</div> */}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium">{data.user}</div>
                    <div className="text-sm text-gray-500">{data.phone}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Badge className="flex-1 py-1.5 justify-center rounded-full border border-green-600 bg-green-50 text-green-600 text-xs hover:bg-green-100">
                    Approve
                  </Badge>
                  <Badge className="flex-1 py-1.5 justify-center rounded-full border border-red-600 bg-red-50 text-red-600 text-xs hover:bg-red-100">
                    Reject
                  </Badge>
                  <Badge className="flex-1 py-1.5 justify-center rounded-full border border-blue-600 bg-blue-50 text-blue-600 text-xs hover:bg-blue-100">
                    Screenshot
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b">
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md"
          >
            View All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="p-2 pt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-[14px]">
            <tbody>
              {recentDepositWithdrawal.map((data) => (
                <tr key={data.id} className=" hover:bg-muted/50">
                  {/* Icon Column */}
                  <td className="p-1 w-6">
                    {title === "Recent Withdrawals" ? (
                      <ArrowDownLeft className="h-6 w-6 rounded-full text-white bg-[#FF0000]" />
                    ) : (
                      <ArrowUpRight className="h-6 w-6 rounded-full text-white bg-[#1ACC1A]" />
                    )}
                  </td>

                  {/* Investment Type Column */}
                  <td className=" p-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getUsdtlogo()}
                      <span className="font-medium">{data.amount}</span>
                    </div>
                  </td>
                  {/* Phone Column */}
                  <td className="p-2 whitespace-nowrap">
                    <span className="text-muted-foreground">{data.phone}</span>
                  </td>
                  {/* User Column */}
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getUserAvatar()}
                      <span className="font-medium">{data.user}</span>
                    </div>
                  </td>

                  {/* Amount Column */}
                  <td className="p-2 whitespace-nowrap">
                    <Badge className="rounded-full border border-green-600 bg-green-50 text-green-600 text-[10px] cursor-pointer">
                      Approve
                    </Badge>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <Badge className="rounded-full border border-red-600 bg-red-50 text-red-600 text-[10px] cursor-pointer">
                      Reject
                    </Badge>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <Badge className="rounded-full hover:cursor-pointer border border-blue-600 text-[10px] bg-blue-50 text-blue-600">
                      {title === "Recent Withdrawals"
                        ? "Wallet QR"
                        : " Screenshot"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentDepositWithdrawal;
