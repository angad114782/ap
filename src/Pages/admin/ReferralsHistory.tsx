import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const ReferralsHistory = () => {
type ReferralItem = {
  user: {
    name: string;
    email: string;
    mobile: string;
    profilePic?: string;
    referralCode?: string;
  };
  bonusEarned: number;
  joinedAt: string;
};


  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_URL}/admin/referral-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReferrals(response.data.downline || []);
      } catch (err) {
        toast.error("Failed to fetch referrals");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Referrals History
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">
              {referrals.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Total Referrals
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              ${referrals.reduce((acc, r) => acc + (r.bonusEarned || 0), 0).toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Total Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {referrals.filter((r) => new Date(r.joinedAt).getMonth() === new Date().getMonth()).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">
              5.5%
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Commission Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Referral Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : referrals.length === 0 ? (
            <div>No referrals yet.</div>
          ) : (
            <div className="space-y-4">
              {referrals.map((r, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
  {r?.user?.name
    ? r.user.name.split(" ").map((n) => n[0]).join("")
    : "NA"}
</AvatarFallback>

                    </Avatar>
                    <div>
                      <div className="font-medium">{r.user.name}</div>
                      <div className="text-sm text-gray-500">
                        Referral Code: {r.user.referralCode || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto sm:ml-auto">
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="font-semibold">
                        ${r.bonusEarned.toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Commission
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(r.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Badge variant="default" className="w-fit">
                      Paid
                    </Badge>
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
