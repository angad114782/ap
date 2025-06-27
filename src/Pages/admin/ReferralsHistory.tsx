import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// /admin/referral-history
export const ReferralHistory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [referrralHistoryData, setReferralHistoryData] = useState<any>([]);

  const navigate = useNavigate();
  useEffect(() => {
    getReferralHistory();
  }, []);

  const getReferralHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-register");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_URL}/admin/referral-history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) throw new Error("401");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      console.log(data, "data");
      setReferralHistoryData(data);
    } catch (error) {
      toast.error("Failed to load wallet balance");
      {
        localStorage.removeItem("token");
        navigate("/login-register");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <CardTitle className="text-lg sm:text-xl">
            Referral Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {referrralHistoryData?.downline?.map((data: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {data?.user?.profilePic ? (
                      <img
                        src={`${import.meta.env.VITE_URL.slice(0, -4)}${data?.user?.profilePic}`}
                        alt={`User Picture`}
                        className="w-10 h-10 object-contain rounded-full"
                      />
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                    <div>
                      <div className="font-medium">{data.user.name || data.user.mobile}</div>
                      <div className="text-sm text-gray-500">{data.user.referralCode || "N/A"}</div>
                    </div>
                  </div>

                  {/* Referred By Info */}
                  <div className="text-sm text-gray-500 font-semibold">Referred By</div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {data?.referredBy?.profilePic ? (
                      <img
                        src={`${import.meta.env.VITE_URL.slice(0, -4)}${data.referredBy.profilePic}`}
                        alt={`Referrer Picture`}
                        className="w-10 h-10 object-contain rounded-full"
                      />
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                    <div>
                      <div className="font-medium">{data?.referredBy?.name || data?.referredBy?.mobile}</div>
                      <div className="text-sm text-gray-500">{data?.referredBy?.referralCode || "N/A"}</div>
                    </div>
                  </div>

                  {/* Right Side Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto sm:ml-auto">
                  <div className="text-left sm:text-right w-full sm:w-auto">
  <div className="font-semibold">₹{(data.bonusEarned || 0).toLocaleString()}</div>
  <div className="text-xs sm:text-sm text-gray-500">Commission Bonus</div>
</div>


                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="font-semibold">
                          <div className="flex items-center gap-1">
                            <div>Downline</div>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {data.downlines?.length > 0 ? (
                            data.downlines.map((d: any, idx: number) => (
                              <DropdownMenuItem key={idx}>{d.name || d.mobile}</DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>No Downline</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="text-xs sm:text-sm text-gray-500">Downline</div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const renderReferralsHistory = () => {
  return <ReferralHistory />;
};
