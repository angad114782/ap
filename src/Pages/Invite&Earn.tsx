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
  bonusEarned: number;
  parentName: string;
};



const InviteAndEarn = () => {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("N/A");
  const [referredFriends, setReferredFriends] = useState<ReferredFriend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchReferralInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_URL;

      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }

      // ✅ Step 1: Fetch user profile
      const userRes = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login-register");
        return;
      }

      const userData = await userRes.json();
      setReferralCode(userData.referralCode || "N/A");

      // ✅ Step 2: Fetch referral tree
      const treeRes = await fetch(`${BASE_URL}/my-referral-tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!treeRes.ok) throw new Error("Referral tree fetch failed");

      const treeData = await treeRes.json();

const formatted: ReferredFriend[] = treeData.downline.map((entry: any) => ({
  mobile: entry.user?.mobile || "N/A",
  name:
    entry.user?.name?.trim() ||
    entry.user?.email?.trim() ||
    entry.user?.mobile ||
    "N/A",
  joinedAt: entry.joinedAt || null,
  bonusEarned: entry.bonusEarned || 0,
  parentName: entry.parentReferralCode || "N/A", // fallback if full name not coming
}));




      setReferredFriends(formatted);
    } catch (err) {
      console.error("❌ Referral Info Fetch Error:", err);
      toast.error("Failed to load referral info");
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
          <div className="text-[26px] font-racing leading-[100%]">Invite & Earn</div>
          <img src={inviteearn} className="h-[100px] sm:h-[146px] w-auto" alt="Invite & Earn" />
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
        <div className="rounded-md overflow-auto max-w-full">
          <div className="overflow-auto rounded-md max-w-full">
  <table className="min-w-[800px] table-auto border border-gray-700 text-sm text-white w-full">
    <thead className="bg-[#3d3b3b] font-bold text-xs">
      <tr>
        <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700">Mobile Number</th>
        <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700">Profile Name</th>
        <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700">Downliner</th>
        <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700">Date Joined</th>
        <th className="px-4 py-2 text-left whitespace-nowrap border-b border-gray-700">Bonus Earned</th>
      </tr>
    </thead>
    <tbody>
      {referredFriends.length > 0 ? (
        referredFriends.map((friend, idx) => (
          <tr
            key={idx}
            className={idx % 2 === 0 ? "bg-[#4c4343]" : "bg-[#716666]"}
          >
            <td className="px-4 py-2 whitespace-nowrap">{friend.mobile}</td>
            <td className="px-4 py-2 whitespace-nowrap">{friend.name}</td>
            <td className="px-4 py-2 whitespace-nowrap">{friend.parentName}</td>
            <td className="px-4 py-2 whitespace-nowrap">
              {friend.joinedAt
                ? new Date(friend.joinedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </td>
            <td className="px-4 py-2 whitespace-nowrap">${friend.bonusEarned.toFixed(2)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="text-center py-4 text-gray-400">
            No referrals yet.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default InviteAndEarn;
