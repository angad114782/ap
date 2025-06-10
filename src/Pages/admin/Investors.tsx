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
  name: string;
  mobile: string;
  profilePic?: string; // Optional if not always available
  totalInvested: number;
  joinDate: string; // ISO date string
  status: "Active" | "Inactive";
}
export interface InvestorsResponse {
  investors: Investor[];
}

// const investors: Investor[] = [
//   {
//     name: "John William",
//     mobile: "+1 234-567-8901",
//     totalInvested: "25,000",
//     status: "Active",
//     joinDate: "2023-01-15",
//   },
//   {
//     name: "Sarah Johnson",
//     mobile: "+1 345-678-9012",
//     totalInvested: "18,500",
//     status: "Active",
//     joinDate: "2023-02-20",
//   },
//   {
//     name: "Mike Chen",
//     mobile: "+1 456-789-0123",
//     totalInvested: "32,000",
//     status: "Inactive",
//     joinDate: "2023-01-10",
//   },
//   {
//     name: "Emily Davis",
//     mobile: "+1 567-890-1234",
//     totalInvested: "15,750",
//     status: "Active",
//     joinDate: "2023-03-05",
//   },
// ];

export const InvestorsList = () => {
  const [investorsList, setInvestorsList] = useState<Investor[]>([]);

  const totalInvestors = investorsList.length;
  const activeInvestors = investorsList.filter(
    (i) => i.status === "Active"
  ).length;
  const inactiveInvestors = totalInvestors - activeInvestors;
  const newThisMonth = investorsList.filter(
    (i) =>
      new Date(i.joinDate).getMonth() === new Date().getMonth() &&
      new Date(i.joinDate).getFullYear() === new Date().getFullYear()
  ).length;

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  console.log("InvestorsList component rendered", investorsList);

  useEffect(() => {
    getAllInvestors();
  }, []);
  const getAllInvestors = async () => {
    setIsLoading(true);
    try {
      const data = await investmentService.fetchInvestments();
      console.log("Fetched investors:", data);
      if (data && data.investors) {
        setInvestorsList(data.investors); // updated key
      } else {
        toast.error("No investors found");
      }
    } catch (error: any) {
      console.error("Investment error:", error);
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

  // const handleStatusChange = (
  //   index: number,
  //   newStatus: "Active" | "Inactive"
  // ) => {
  //   const updatedInvestors = [...investorsList];
  //   updatedInvestors[index] = {
  //     ...updatedInvestors[index],
  //     status: newStatus,
  //   };
  //   setInvestorsList(updatedInvestors);
  //   // Add API call here
  // };
  isLoading && (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg font-semibold text-gray-700">Loading...</div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Investor Management
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 md:gap-4">
        {[
          {
            label: "Total Investors",
            value: { totalInvestors },
            color: "text-blue-600",
          },
          {
            label: "Active Investors",
            value: { activeInvestors },
            color: "text-green-600",
          },
          {
            label: "Inactive",
            value: { inactiveInvestors },
            color: "text-orange-600",
          },
          {
            label: "New This Month",
            value: { newThisMonth },
            color: "text-purple-600",
          },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === "object"
                  ? Object.values(stat.value)[0]
                  : stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Investor List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Investor List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investorsList.map((investor, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"
            >
              {/* Info Block */}
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {investor.profilePic ? (
                      <img
                        src={`${import.meta.env.VITE_URL.slice(0, -4)}${
                          investor.profilePic
                        }`}
                        alt={investor.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm">
                        {investor?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{investor.name}</div>
                  <div className="text-sm text-gray-500">{investor.mobile}</div>
                </div>
              </div>

              {/* Investment Info */}
              <div className="flex flex-wrap sm:flex-nowrap md:flex-wrap gap-4 sm:gap-6 justify-between sm:justify-start">
                <div className="text-left">
                  <div className="font-semibold">${investor.totalInvested}</div>
                  <div className="text-xs text-gray-500">Total Invested</div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">
                    Joined: {new Date(investor.joinDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="w-full sm:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant={
                          investor.status === "Active" ? "default" : "secondary"
                        }
                        className="cursor-pointer hover:opacity-80 w-full sm:w-[100px] text-center"
                      >
                        {investor.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      alignOffset={0}
                      sideOffset={5}
                      className="w-[100px]"
                    >
                      <DropdownMenuItem
                        // onClick={() => handleStatusChange(index, "Active")}
                        className={`${
                          investor.status === "Active" ? "text-green-600" : ""
                        } justify-center`}
                      >
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        // onClick={() => handleStatusChange(index, "Inactive")}
                        className={`${
                          investor.status === "Inactive" ? "text-gray-600" : ""
                        } justify-center`}
                      >
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
