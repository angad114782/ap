import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const investors = [
  {
    name: "John William",
    email: "john@example.com",
    totalInvested: "25,000",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    totalInvested: "18,500",
    status: "Active",
    joinDate: "2023-02-20",
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    totalInvested: "32,000",
    status: "Inactive",
    joinDate: "2023-01-10",
  },
  {
    name: "Emily Davis",
    email: "emily@example.com",
    totalInvested: "15,750",
    status: "Active",
    joinDate: "2023-03-05",
  },
];
export const renderReferralsHistory = () => (
  <div className="space-y-6 p-4 md:p-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
        Referrals History
      </h2>
    </div>

    {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">
            453
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Total Referrals
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            $12,450
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Total Earnings</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">89</div>
          <div className="text-xs sm:text-sm text-gray-500">This Month</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-lg sm:text-2xl font-bold text-orange-600">
            5.5%
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Commission Rate
          </div>
        </CardContent>
      </Card>
    </div> */}

    {/* Referral Activity Card */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Referral Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investors.map((investor, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {investor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{investor.name}</div>
                  <div className="text-sm text-gray-500">
                    Referred by: John Doe
                  </div>
                </div>
              </div>

              {/* Mobile: Stack vertically, Desktop: Show in row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto sm:ml-auto">
                {/* Commission Info */}
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">ReferCode Data</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Refer Code
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">TotalInvest Data</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Total Invest
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">TotalCommission Data</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Total Commission Bonus
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">Upline Data</div>
                  <div className="text-xs sm:text-sm text-gray-500">Upline</div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">Downline Data</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Downline
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-semibold">$125.50</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Commission
                  </div>
                </div>

                {/* Date */}
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {new Date(investor.joinDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Status Badge */}
                {/* <Badge variant="default" className="w-fit">
                  Paid
                </Badge> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
