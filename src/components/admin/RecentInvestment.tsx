import React, { useState } from "react";
import recentInvestmentLogo from "@/assets/RecentInvestmentLogo.tsx.svg";
import virat from "@/assets/viratnew.avif";
export interface RecentInvestmentData {
  type: string;
  user: string;
  phone: string;
  amount: string;
  currency: string;
  date: string;
}
interface RecentInvestmentsProps {
  data?: RecentInvestmentData[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}
const RecentInvestments = ({
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

  const recentInvestments = data.length > 0 ? data : [];

  const getUserAvatar = () => (
    <div className="w-8 h-8 border-1 rounded-full flex items-center justify-center flex-shrink-0">
      <img src={virat} alt="" className="w-8 h-8" />
      {/* <span className="text-white text-xs">👤</span> */}
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
        <div className="p-6 pt-0">
          <div className="space-y-3">
            {recentInvestments.map((investment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {/* {getIcon()} */}
                  <img
                    src={recentInvestmentLogo}
                    className="h-10 w-10"
                    alt=""
                  />
                  <div>
                    <div className="font-medium text-sm">{investment.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {investment.user}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {investment.amount} {investment.currency}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {investment.date}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {investment.phone}
                  </div>
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
              {recentInvestments.map((investment, index) => (
                <tr key={index} className=" hover:bg-muted/50">
                  {/* Icon Column */}
                  <td className="p-2 w-16">
                    <img
                      src={recentInvestmentLogo}
                      className="h-6 w-6 object-contain"
                      alt=""
                    />
                  </td>

                  {/* Investment Type Column */}
                  <td className=" p-2 whitespace-nowrap">
                    <span className="font-medium">{investment.type}</span>
                  </td>

                  {/* User Column */}
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getUserAvatar()}
                      <span className="font-medium">{investment.user}</span>
                    </div>
                  </td>

                  {/* Phone Column */}
                  <td className="p-2 whitespace-nowrap">
                    <span className="text-muted-foreground">
                      {investment.phone}
                    </span>
                  </td>

                  {/* Amount Column */}
                  <td className="p-2 whitespace-nowrap">
                    <span className="font-semibold">{investment.amount}</span>
                  </td>

                  {/* Currency Column */}
                  <td className="p-2 whitespace-nowrap">
                    <span className="text-muted-foreground">
                      {investment.currency}
                    </span>
                  </td>

                  {/* Date Column */}
                  <td className="p-2 whitespace-nowrap">
                    <span className="text-muted-foreground text-sm">
                      {investment.date}
                    </span>
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

export default RecentInvestments;
