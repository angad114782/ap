"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { investmentService } from "@/services/investmentService";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Investor {
  id: string;
  name: string;
  mobile: string;
  profilePic?: string;
  joinDate: string;
  status: "Active" | "Inactive";
  referredBy?: string;
  referralCode?: string;
  totalInvested: number;
  investments: { plan: string; amount: number }[];
}

export interface InvestorsResponse {
  investors: Investor[];
}

export const InvestorsList = () => {
  const [investorsList, setInvestorsList] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const totalInvestors = investorsList.length;
  const activeInvestors = investorsList.filter(i => i.status === "Active").length;
  const inactiveInvestors = totalInvestors - activeInvestors;
  const newThisMonth = investorsList.filter(i => {
    const join = new Date(i.joinDate);
    const now = new Date();
    return join.getMonth() === now.getMonth() && join.getFullYear() === now.getFullYear();
  }).length;

  useEffect(() => {
    getAllInvestors();
  }, []);

  const getAllInvestors = async () => {
    setIsLoading(true);
    try {
      const data = await investmentService.fetchInvestments();
      if (data && data.investors) {
        setInvestorsList(data.investors);
      } else {
        toast.error("No investors found");
      }
    } catch (error: any) {
      if (error.message.includes("login")) {
        toast.error("Session expired. Please login again");
        setTimeout(() => navigate("/login-register"), 1500);
      } else {
        toast.error(error.message || "Failed to load investors");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "Active" | "Inactive") => {
    try {
      await investmentService.updateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      getAllInvestors();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Investor Management</h2>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 md:gap-4">
        {[{
          label: "Total Investors", value: totalInvestors, color: "text-blue-600"
        }, {
          label: "Active Investors", value: activeInvestors, color: "text-green-600"
        }, {
          label: "Inactive", value: inactiveInvestors, color: "text-orange-600"
        }, {
          label: "New This Month", value: newThisMonth, color: "text-purple-600"
        }].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
<div className="block md:hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Investor List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investorsList.map((investor) => (
            <div key={investor.id} className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>
                    {investor.profilePic ? (
                      <img
                        src={`${import.meta.env.VITE_URL.slice(0, -4)}${investor.profilePic}`}
                        alt={investor.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm">{investor.name.charAt(0).toUpperCase()}</span>
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate" title={investor.name}>{investor.name}</div>
                  <div className="text-sm text-gray-500 truncate">Ref Code: {investor.referralCode || "N/A"}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <div className="font-medium">{investor.mobile}</div>
                  <div className="text-sm text-gray-500">Mobile</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-medium">{investor.referredBy || "N/A"}</div>
                  <div className="text-sm text-gray-500">Upline</div>
                </div>
                {/* <div className="text-left sm:text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="font-semibold">
                      <div className="flex items-center">Plan Invested <ChevronDown /></div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                  {investor.investments?.length > 0 ? (
  [...new Set(investor.investments.map((inv) => inv.plan))].map((planName, idx) => (
    <DropdownMenuItem key={idx}>{planName}</DropdownMenuItem>
  ))
) : (
  <DropdownMenuItem disabled>No Plans</DropdownMenuItem>
)}

                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="text-sm text-gray-500">Plan Invested</div>
                </div> */}
                <div className="text-left sm:text-right">
                  <div className="font-medium">
  ₹{(investor.totalInvested ?? 0).toLocaleString()}
</div>

                  <div className="text-sm text-gray-500">Currently Invested</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto sm:ml-auto">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-gray-500">
                    Joined: {new Date(investor.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant={investor.status === "Active" ? "default" : "secondary"}
                        className="cursor-pointer hover:opacity-80 w-full sm:w-[100px] text-center"
                      >
                        {investor.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[100px]">
                      <DropdownMenuItem onClick={() => handleStatusChange(investor.id, "Active")}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(investor.id, "Inactive")}>Inactive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    {/* Table layout for desktop only */}
<div className="hidden md:block">
  <Card>
    <CardHeader>
      <CardTitle className="text-lg sm:text-xl">Investor List</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Mobile</th>
            <th className="px-4 py-2 text-left">Upline</th>
            {/* <th className="px-4 py-2 text-left">Plans</th> */}
            <th className="px-4 py-2 text-left">Total Invested</th>
            <th className="px-4 py-2 text-left">Joined</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {investorsList.map((investor) => (
            <tr key={investor.id}>
              <td className="px-4 py-2 font-medium flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {investor.profilePic ? (
                      <img
                        src={`${import.meta.env.VITE_URL.slice(0, -4)}${investor.profilePic}`}
                        alt={investor.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xs">{investor.name.charAt(0).toUpperCase()}</span>
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{investor.name}</div>
                  <div className="text-xs text-gray-500">Ref: {investor.referralCode || "N/A"}</div>
                </div>
              </td>
              <td className="px-4 py-2">{investor.mobile}</td>
              <td className="px-4 py-2">{investor.referredBy}</td>
              {/* <td className="px-4 py-2">
                {investor.investments?.length > 0 ? (
                  [...new Set(investor.investments.map((inv) => inv.plan))].join(", ")
                ) : (
                  <span className="text-gray-400">No Plans</span>
                )}
              </td> */}
              <td className="px-4 py-2">₹{(investor.totalInvested ?? 0).toLocaleString()}</td>
              <td className="px-4 py-2">{new Date(investor.joinDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant={investor.status === "Active" ? "default" : "secondary"}
                      className="cursor-pointer hover:opacity-80"
                    >
                      {investor.status}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange(investor.id, "Active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(investor.id, "Inactive")}>
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
</div>

  </div>
  );
};
