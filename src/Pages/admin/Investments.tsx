import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Eye, Plus, TrendingUp } from "lucide-react";

interface Investment {
  type: string;
  user: string;
  phone: string;
  amount: string;
  currency: string;
  date: string;
}

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

export const Investments = () => {
  const [investments] =
    useState<Investment[]>(recentInvestments);
  const [stats] = useState({
    totalInvested: 125430,
    totalProfit: 15230,
    activeInvestments: 234,
    averageROI: 12.5,
  });

  useEffect(() => {
    // Fetch investments data here when API is ready
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Overview</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Investment
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              ${stats.totalInvested.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Invested</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Profit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeInvestments}
            </div>
            <div className="text-sm text-gray-500">Active Investments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageROI}%
            </div>
            <div className="text-sm text-gray-500">Average ROI</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      investment.type === "Gold"
                        ? "bg-yellow-100"
                        : investment.type === "Diamond"
                        ? "bg-blue-100"
                        : investment.type === "Platinum"
                        ? "bg-gray-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <TrendingUp
                      className={`w-6 h-6 ${
                        investment.type === "Gold"
                          ? "text-yellow-600"
                          : investment.type === "Diamond"
                          ? "text-blue-600"
                          : investment.type === "Platinum"
                          ? "text-gray-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{investment.type} Plan</div>
                    <div className="text-sm text-gray-500">
                      {investment.user}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${investment.amount}</div>
                  <div className="text-sm text-gray-500">
                    Started: {investment.date}
                  </div>
                </div>
                <Badge>Active</Badge>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
