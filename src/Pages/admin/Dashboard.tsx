import RecentDepositWithdrawal from "@/components/admin/RecentDeposit-Withdrawal";
import RecentInvestments from "@/components/admin/RecentInvestment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const walletStats = [
  { label: "Memecoin", value: "$107,884.21" },
  { label: "Binance", value: "$55,411.33" },
  { label: "Trust Wallet", value: "$81,880.22" },
  { label: "Coinbase", value: "$12,432.51" },
];

const recentInvestments = [
  {
    type: "Gold",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
  {
    type: "Diamond",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
  {
    type: "Platinum",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
  {
    type: "Gold",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
  {
    type: "Master",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
  {
    type: "Gold",
    user: "John William",
    phone: "+918596464568",
    amount: "5000.00",
    currency: "USDT",
    date: "21st May 2023 1:15 AM",
  },
];

const transactions = [
  { id: "1", user: "John William", phone: "+918596464568", amount: "5000.00" },
  { id: "2", user: "Jane Doe", phone: "+918596464569", amount: "3000.00" },
  { id: "3", user: "Alice Smith", phone: "+918596464570", amount: "4500.00" },
  { id: "4", user: "Bob Johnson", phone: "+918596464571", amount: "7000.00" },
  { id: "5", user: "Charlie Brown", phone: "+918596464572", amount: "6000.00" },
];

// First, create a proper component instead of just a render function
const DashboardComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  md:gap-6">
        <Card className="shadow-2xl">
          <CardContent className="px-6 ">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">98,455</div>
                <div className="text-sm text-gray-500">
                  Total Wallet Balance
                </div>
                <div className="text-xs text-orange-600">USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">22,567</div>
                <div className="text-sm text-gray-500">Today's Deposit</div>
                <div className="text-xs text-green-600">USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,38,33</div>
                <div className="text-sm text-gray-500">Today's Withdrawals</div>
                <div className="text-xs text-red-600">USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl">
          <CardContent className="px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">8,734</div>
                <div className="text-sm text-gray-500">
                  Today's Profit & Loss
                </div>
                <div className="text-xs text-blue-600">USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Wallet Statistics */}
        <Card className="col-span-1 lg:col-span-1 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Wallet Statistic</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/wallet")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {walletStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-purple-500"
                        : index === 1
                        ? "bg-blue-500"
                        : index === 2
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Investment */}
        <div className="col-span-1 lg:col-span-3">
          <RecentInvestments
            data={recentInvestments}
            title="Recent Investment"
            showViewAll={true}
            onViewAll={() => navigate("/admin/investments")}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentDepositWithdrawal
          data={transactions}
          title="Recent Deposit"
          showViewAll
          onViewAll={() => navigate("/admin/deposit")}
        />
        <RecentDepositWithdrawal
          data={transactions}
          title="Recent Withdrawals"
          showViewAll
          onViewAll={() => navigate("/admin/withdrawals")}
        />
      </div>
    </div>
  );
};

// Then update the render function to use the component
export const renderDashboard = () => {
  return <DashboardComponent />;
};
