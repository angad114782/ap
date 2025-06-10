import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Eye,
  Filter,
} from "lucide-react";
const transactions = Array(8)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    amount: "5000.00",
    phone: "+918596464568",
    user: "John William",
    type: i % 2 === 0 ? "deposit" : "withdrawal",
    status: ["pending", "completed", "failed"][Math.floor(Math.random() * 3)],
    date: "21st May 2023 1:15 AM",
  }));

export const renderTransactions = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      <div className="flex gap-2">
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">$90,860</div>
          <div className="text-sm text-gray-500">Total Transactions</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">2,347</div>
          <div className="text-sm text-gray-500">Total Count</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">156</div>
          <div className="text-sm text-gray-500">Pending</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-600">23</div>
          <div className="text-sm text-gray-500">Failed</div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "deposit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "deposit" ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.user}</div>
                  <div className="text-sm text-gray-500">
                    {transaction.phone}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold">${transaction.amount}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {transaction.type}
                </div>
              </div>
              <div className="text-sm text-gray-500">{transaction.date}</div>
              <Badge
                variant={
                  transaction.status === "completed"
                    ? "default"
                    : transaction.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {transaction.status}
              </Badge>
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
