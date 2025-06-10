import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import inviteearn from "../assets/InviteEarn.svg";
import CopyButton from "../components/CopyButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type ReferredFriend = {
  mobile: string;
  name: string;
  joinedAt: string | null;
};

const InviteAndEarn = () => {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");
  const [referredFriends, setReferredFriends] = useState<ReferredFriend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferralInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const BASE_URL = import.meta.env.VITE_URL; // Ensure this is https://apart-x.pro/api

    if (!token) {
      toast.error("Please login again");
      navigate("/login-register");
      return;
    }

    // ✅ Fetch user profile
    const userRes = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!userRes.ok) {
      if (userRes.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login-register");
        return;
      }
      throw new Error(`User fetch failed with status ${userRes.status}`);
    }

    const userData = await userRes.json();
    setReferralCode(userData.referralCode || "N/A");

    // ✅ Fetch referred users
    const referredRes = await fetch(`${BASE_URL}/referrals/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!referredRes.ok) {
      throw new Error(`Referred users fetch failed with status ${referredRes.status}`);
    }

    const referredData = await referredRes.json();
    setReferredFriends(referredData.referred || []);
  } catch (error) {
    console.error("❌ Referral Info Fetch Error:", error);
    toast.error("Failed to load referral data");
  } finally {
    setIsLoading(false);
  }
};


    fetchReferralInfo();
  }, [navigate]);

  const getCurrentDomain = () => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    return `${protocol}//${hostname}${port}`;
  };

  const referralLink = `${getCurrentDomain()}/register?ref=${referralCode}`;

  if (isLoading) {
    return <div className="text-white text-center mt-4">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-black text-white overflow-hidden">
      {/* Top Section */}
      <div className="shrink-0">
        <div className="absolute h-[180px] inset-x-0 top-0 bg-gradient-to-b from-[#6552FE] via-[#683594] to-[#6B1111] opacity-90 z-10" />
        <div className="relative z-20 pt-6 pl-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white text-sm"
          >
            <ArrowLeft size={20} className="h-8 w-8 text-white" />
          </button>
        </div>

        <div className="flex justify-around items-center mt-[40px] relative z-10">
          <div className="text-[26px] font-racing leading-[100%]">
            Invite & Earn
          </div>
          <img src={inviteearn} className="h-[100px] sm:h-[146px] w-auto" alt="" />
        </div>

        <div className="text-center my-3 text-xl font-bold z-10">
          <span className="text-white">Apart-</span>
          <span className="text-[#6552FE] font-bold">X</span>
          <span className="text-white"> Referral Program</span>
        </div>

        <div className="text-[14px] mx-auto max-w-[380px] p-3 text-center">
          Invite & Earn up to 6% extra income bonus on deposit by your friend as a reward. Be your own boss!
        </div>

        {/* Referral Code */}
        <div className="mx-auto py-2 mt-2 w-[200px] h-[40px] text-center bg-[#4C4343] rounded-md flex items-center justify-center px-4">
          <div className="text-white leading-[32px] flex justify-center text-[23px] font-medium">
            {referralCode}
          </div>
          <CopyButton textToCopy={referralCode} />
        </div>

        {/* Referral Link */}
        <div className="ml-1 mt-2 flex items-center space-x-2 px-3">
          <div className="w-[90%] h-10 justify-center px-1 flex items-center text-[14px] text-black bg-white rounded-md overflow-x-auto">
            {referralLink}
          </div>
          <CopyButton textToCopy={referralLink} />
        </div>
      </div>

      {/* Referred Friends Table */}
      <div className="flex-1 overflow-y-auto mt-4 mb-4 px-4">
        <div className="text-sm mb-2">Referred Friends</div>
        <div className="rounded-md overflow-hidden">
          <div className="grid grid-cols-3 text-center bg-[#3d3b3b] py-2 text-xs font-bold">
            <div>Mobile Number</div>
            <div>Profile Name</div>
            <div>Date to Join</div>
          </div>
          {referredFriends.length > 0 ? (
            referredFriends.map((friend, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 text-center py-2 text-sm border-t border-gray-700 ${
                  idx % 2 === 0 ? "bg-[#4c4343]" : "bg-[#716666]"
                }`}
              >
                <div>{friend.mobile}</div>
                <div>{friend.name || "N/A"}</div>
                <div>
                {friend.joinedAt
  ? new Date(friend.joinedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "—"}


                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-400">
              No referrals yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
