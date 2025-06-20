import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import USDTLOGO from "../assets/usdt logo.svg";
import { ArrowLeft } from "lucide-react";

const ReceiveCurrency = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login-register");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        // Handle profile picture URL
        const userData = response.data;
        if (userData.profilePic) {
          userData.profilePic = `${import.meta.env.VITE_URL.slice(0, -4)}${
            userData.profilePic
          }`;
        }

        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Please login again");
          navigate("/login-register");
        } else {
          toast.error("Failed to load user data");
        }
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const backnavigation = () => {
    {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 10) {
      toast.error("Minimum withdrawal is 10 points");
      return;
    }

  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Saturday = 6

  // Check for weekend
  if (day === 0 || day === 6) {
    toast.error("Withdrawals are not allowed on Saturday or Sunday due to market closure.");
    return;
  }

  // Navigate to next screen
  navigate("/receive-final", {
    state: { amount: parseFloat(amount) },
  });
};



  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">Loading...</div>
  //   );
  // }
  return (
    <div className="flex flex-col h-full w-full bg-[#070707] py-6 overflow-y-auto overflow-x-hidden px-3">
      {/* Top Back Button + Line */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
        
          {" "}
          <div className="flex flex-col gap-1 mb-3">
            <button
              onClick={backnavigation}
              className="flex items-center gap-2 text-white text-sm"
            >
              <ArrowLeft size={20} className="h-8 w-8 m-1 text-white" />
            </button>
            <div className="border-t border-white border-4 w-full" />
          </div>
          {/* Content */}
          <div className="flex flex-col gap-6 w-full flex-grow">
            {/* Header */}
            <div className="flex-none text-start">
              <h2 className="mt-3 font-medium text-[#F7F7F7] text-[22px] leading-tight">
                Enter Amount
              </h2>
              <p className="text-[#F7F7F7] text-sm mt-1">
                Enter amount of crypto currency to receive.
              </p>
            </div>

            {/* Form */}
            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-[350px] pb-2 border-1 relative border-white rounded-[20px] flex justify-center">
                <div className="flex flex-col items-center w-full">
                  {userData?.profilePic ? (
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="h-[80px] w-[80px] rounded-full border-2 border-white mt-2 object-cover"
                    />
                  ) : (
                    <div className="h-[80px] w-[80px] rounded-full border-2 border-white mt-2 bg-gradient-to-br from-[#6552FE] to-[#8B5CF6] flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div className="text-white text-[20px] text-center mt-2">
                    {userData?.name || "User"}
                  </div>
                  <div className="mt-4 w-full flex justify-center">
                    <div className="bg-black w-[160px] mb-2 items-center rounded-lg gap-4 justify-center h-[60px] mx-auto flex">
                      <img
                        className="h-[50px] w-[50px]"
                        src={USDTLOGO}
                        alt="USDT"
                      />
                      <div className="text-white text-[20px]">USDT</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-14 mb-2 bg-transparent rounded-none px-4 border-b-1 border-b-white border-t-0 border-l-0 border-r-0 w-[250px] mt-4 text-white focus:outline-none text-2xl text-center placeholder:text-xl mx-auto"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-10">
              <Button
                className="w-full h-12 hover:bg-slate-500 bg-[#6552FE] text-white font-semibold rounded-[16px]"
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiveCurrency;
