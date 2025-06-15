import logo from "@/assets/ApartX 1.svg";
import Title from "@/assets/Group 48095580.svg";
import UserImage from "@/assets/viratnew.avif";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { renderDashBoardTabs } from "@/Pages/admin/DashboardTabs";
import { InvestorsList } from "@/Pages/admin/Investors";
import Plans from "@/Pages/admin/Plans";

// import { renderSettings } from "@/Pages/admin/Settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSendCurrency } from "@/hooks/useSendCurrency";
import { renderWalletSetting } from "@/Pages/admin/WalletSetting";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Gift,
  Lock,
  LogOut,
  Menu,
  // Settings,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { PasswordChangeDialog } from "./PasswordChange";
import { ProfileEditDialog } from "./Profile";
import { renderReferralsHistory } from "@/Pages/admin/ReferralsHistory";

const Dashboard = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    try {
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login-register");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login again");
          navigate("/login-register");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setAdminProfile({
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          });
        }
      } catch (error) {
        toast.error("Failed to load admin profile");
        console.error("Admin profile fetch error:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [receiveCurrencydata, setReceiveCurrencydata] = useState<any[]>([]);
  const [investmentsData, setInvestmentsData] = useState<any[]>([]);
  const [adminPassbook, setAdminPassbook] = useState<any[]>([]);
  const {
    data: sendCurrencyData,
    loading,
    updateStatus,
    refresh,
  } = useSendCurrency();
  // console.log(sendCurrencyData, "asdsadasdadas");
  useEffect(() => {
    getReceiveCurrencyData();
    GetAllInvestmentsData();
    getAdminPassbooks();
  }, []);

  const GetAllInvestmentsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/all-investments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data) {
        setInvestmentsData(response.data.investments || []);
        return response.data; // Adjust based on your API response structure
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching receive currency data:", error);
      toast.error("Failed to fetch receive currency data");
    }
  };
  const getReceiveCurrencyData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_URL}/receive`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.data) {
        setReceiveCurrencydata(response.data.data || []);
        return response.data.receiveCurrency; // Adjust based on your API response structure
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching receive currency data:", error);
      toast.error("Failed to fetch receive currency data");
    }
  };
  const getAdminPassbooks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login-register");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/admin/passbooks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data) {
        setAdminPassbook(response.data.data || []);
        return response.data; // Adjust based on your API response structure
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching receive currency data:", error);
      toast.error("Failed to fetch admin passbook data");
    }
  };

  const updateWithdrawalStatus = async (
    id: string,
    status: string,
    remark: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login-register");
        throw new Error("Authorization token missing");
      }

      const response = await axiosInstance.put(
        `${import.meta.env.VITE_URL}/receive/${id}/status`,
        {
          status,
          remark: remark || undefined,
        }
      );

      if (response.data) {
        await getReceiveCurrencyData();
        return true;
      }

      throw new Error(response.data.message || "Failed to update status");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error updating status:", errorMessage);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login-register");
      } else {
        toast.error(errorMessage);
      }

      throw error;
    }
  };

  const openProfileDialog = () => {
    setIsProfileDialogOpen(true);
  };

  const closeProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };

  const openPasswordDialog = () => {
    setIsPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };
  const location = useLocation();
  const navigate = useNavigate();
  // Get the current tab from URL, remove the '/admin/' prefix and capitalize first letter
  const getCurrentTab = () => {
    const path = location.pathname.split("/admin/")[1] || "walletsetting";
    // Convert known path values to match the exact IDs
    const pathMap: { [key: string]: string } = {
      walletsetting: "WalletSetting",
      referralshistory: "ReferralsHistory",
      logout: "LogOut",
      dashboard: "Dashboard",
    };
    return (
      pathMap[path.toLowerCase()] ||
      path.charAt(0).toUpperCase() + path.slice(1)
    );
  };
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    // { icon: Home, label: "Dashboard", id: "Dashboard" },
    { icon: Wallet, label: "Wallet Setting", id: "WalletSetting" },
    { icon: ArrowDownLeft, label: "Deposit", id: "Deposit" },
    { icon: ArrowUpRight, label: "Withdrawals", id: "Withdrawals" },
    { icon: TrendingUp, label: "Investments", id: "Investments" },
    { icon: ArrowUpDown, label: "Transaction", id: "Transaction" },
    { icon: Users, label: "Investors", id: "Investors" },
    { icon: Gift, label: "Plans", id: "Plans" },
    { icon: BarChart3, label: "Referrals History", id: "ReferralsHistory" },
    // { icon: Settings, label: "Settings", id: "Settings" },
    { icon: LogOut, label: "LogOut", id: "LogOut" },
  ];

  // const handleStatusUpdate = async (
  //   id: string,
  //   status: "Approved" | "Disapproved",
  //   remark: string
  // ) => {
  //   try {
  //     await updateStatus(id, status, remark);
  //     toast.success(`Deposit ${status.toLowerCase()} successfully`);
  //     refresh(); // Refresh the data after update
  //   } catch (error) {
  //     toast.error("Failed to update status");
  //   }
  // };

  const renderContent = () => {
    switch (activeTab) {
      // case "Dashboard":
      //   return renderDashboard();
      case "WalletSetting":
        return renderWalletSetting(); // Use as JSX component
      case "Deposit":
        return renderDashBoardTabs({
          title: "Deposit",
          data: Array.isArray(sendCurrencyData)
            ? sendCurrencyData.map((item) => ({
                id: item._id,
                type: "Deposit",
                plan: item.wallet || "N/A",
                profilePic: item?.userId?.profilePic,
                profileName: item.userId?.name || "Unknown User",
                mobile: item.userId?.mobile || "N/A",
                amount: String(item.amount || 0),
                dateTime: new Date(item?.createdAt),
                status: item.status || "Pending",
                remarks: item.remark || "",
                screenshot: item.screenshot || "",
                walletID: item.walletID || "",
              }))
            : [],
          loading,
          onApprove: async (id) => {
            try {
              await updateStatus(id, "Approved", "Deposit approved");
              toast.success("Deposit approved successfully");
              await refresh();
            } catch (error) {
              toast.error("Failed to approve deposit");
            }
          },
          onReject: async (id) => {
            try {
              await updateStatus(id, "Disapproved", "Deposit rejected");
              toast.success("Deposit rejected successfully");
              await refresh();
            } catch (error) {
              console.error("Failed to reject:", error);
              toast.error("Failed to reject deposit");
            }
          },
          updateRemarks: async (id, remarks) => {
            try {
              const currentItem = sendCurrencyData.find(
                (item) => item._id === String(id)
              );
              const currentStatus = currentItem?.status || "Pending";
              await updateStatus(String(id), currentStatus, remarks);
              toast.success("Remarks updated successfully");
              await refresh();
            } catch (error) {
              console.error("Failed to update remarks:", error);
              toast.error("Failed to update remarks");
            }
          },
        });
      case "Withdrawals":
        return renderDashBoardTabs({
          title: "Withdrawals",
          data:
            receiveCurrencydata.length > 0
              ? receiveCurrencydata.map((item) => ({
                  id: item._id,
                  type: "Deposit",
                  plan: item.wallet || "N/A",
                  profilePic: item.userId.profilePic,
                  profileName: item.userId?.name || "Unknown User",
                  mobile: item.userId?.mobile || "N/A",
                  amount: String(item.amount || 0),
                  dateTime: new Date(item?.createdAt),
                  status: item.status || "Pending",
                  remarks: item.remark || "",
                  walletQr: item.walletQrImage,
                  // screenshot: item.screenshot || "",
                  walletID: item.walletID || "",
                }))
              : [],
          loading: false,
          onApprove: async (id) => {
            try {
              await updateWithdrawalStatus(
                id,
                "Approved",
                "Withdrawal approved"
              );
              toast.success("Withdrawal approved successfully");
              await getReceiveCurrencyData();
            } catch (error: any) {
              console.error("Failed to approve:", error);
              toast.error(error.data.message);
            }
          },
          onReject: async (id) => {
            try {
              await updateWithdrawalStatus(
                id,
                "Disapproved",
                "Withdrawal rejected"
              );
              toast.success("Withdrawal rejected successfully");
              await getReceiveCurrencyData();
            } catch (error) {
              console.error("Failed to reject:", error);
              toast.error("Failed to reject Withdrawal");
            }
          },
          updateRemarks: async (id, remarks) => {
            try {
              const currentItem = receiveCurrencydata.find(
                (item) => item._id === String(id)
              );
              const currentStatus = currentItem?.status || "Pending";
              await updateWithdrawalStatus(String(id), currentStatus, remarks);
              toast.success("Remarks updated successfully");
              await getReceiveCurrencyData();
            } catch (error) {
              console.error("Failed to update remarks:", error);
              toast.error("Failed to update remarks");
            }
          },
        });

      case "Investments":
        return renderDashBoardTabs({
          title: "Investments",
          data:
            investmentsData.length > 0
              ? investmentsData.map((item) => ({
                  id: item._id,
                  type: "Deposit",
                  plan: item?.planId?.name || "N/A",
                  profileName: item.userId?.name || "Unknown User",
                  profilePic: item.userId?.profilePic,
                  mobile: item.userId?.mobile || "N/A",
                  amount: String(item.amount || 0),
                  dateTime: new Date(item?.planId?.createdAt),
                  status: item.status || "Pending",
                  remarks: item.remark || "",
                  roi: item.roi,
                  // screenshot: item.screenshot || "",
                  // walletID: item.walletID || "",
                }))
              : [],
        });
      case "Transaction":
        return renderDashBoardTabs({
          title: "Transaction",
          data:
            adminPassbook.length > 0
              ? adminPassbook.map((item) => ({
                  id: item._id,
                  type: "Deposit",
                  plan: item?.walletID || "N/A",
                  profileName: item.userId?.name || "Unknown User",
                  profilePic: item.userId?.profilePic,
                  mobile: item.userId?.mobile || "N/A",
                  amount: String(item.amount || 0),
                  dateTime: new Date(item?.createdAt),
                  status: item.type || "Pending",
                  remarks: item.remark || "",
                  // roi:item.
                  // screenshot: item.screenshot || "",
                  // walletID: item.walletID || "",
                }))
              : [],
        });
      case "Investors":
        return <InvestorsList />;
      case "Plans":
        return <Plans />;
      case "ReferralsHistory":
        return renderReferralsHistory();
      // case "Settings":
      //   return renderSettings();
      case "LogOut":
        return (
          <div className="flex  items-center justify-center h-96">
            <Card className="w-96">
              <CardContent className="p-8 text-center">
                <LogOut className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Confirm Logout</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("Dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleLogout()} variant="destructive">
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        console.log("Current activeTab:", activeTab);
        return renderWalletSetting();
    }
  };

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Convert the URL to lowercase for consistency
    const urlPath = tabId.toLowerCase();
    navigate(`/admin/${urlPath}`);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header
        className={`fixed top-0 font-display h-16 bg-white border-b z-50 transition-all duration-300
        left-0 right-0
        ${isSidebarOpen ? "md:left-64" : "md:left-20"}
        md:right-0
      `}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* <h1 className="text-lg md:text-xl font-semibold">
              Admin Dashboard
            </h1> */}
            <Input
              type="text"
              placeholder="Search..."
              className="  w-64 rounded-full bg-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 w-12 mr-4 rounded-full p-0"
              >
                <Avatar>
                  <AvatarImage
                    src={UserImage}
                    alt="User Avatar"
                    className="h-10 w-10 md:h-12 md:w-12 hover:cursor-pointer rounded-full object-cover"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50 mr-4">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminProfile.name || "Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminProfile.email || "admin@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfileDialog}>
                <User className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openPasswordDialog}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleTabChange("WalletSetting")}
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet Setting</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("Plans")}>
                <Gift className="mr-2 h-4 w-4" />
                <span>Plan</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 font-display bg-transparent bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed font-display bg-white border-r transition-all duration-300 z-40
          ${isSidebarOpen ? "w-64" : "w-20"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          
          // Mobile specific styles
          top-16 bottom-0
          
          // Desktop specific styles
          md:top-0 md:bottom-0 md:translate-x-0
          
          // Shared styles
          left-0
        `}
      >
        <div
          className={`flex items-center justify-center ${
            !isSidebarOpen ? "flex-col gap-0" : "flex"
          }  gap-0.5`}
        >
          <img className="h-24 w-24" src={logo} alt="" />
          <img className=" w-32" src={Title} alt="" />
        </div>
        <Avatar
          className={`${
            isSidebarOpen && !isMobileMenuOpen
              ? "h-[93px] w-[93px]"
              : "h-[30px] w-[30px]"
          } mx-auto my-2 border-1`}
        >
          <AvatarImage
            src={UserImage}
            alt="User Avatar"
            className={`${
              isSidebarOpen ? "h-[93px] w-[93px]" : "h-[30px] w-[30px]"
            } mx-auto my-2 transition-all duration-300 object-contain `}
          />

          <AvatarFallback>
            <User
              className={`${
                isSidebarOpen ? "h-[93px] w-[93px]" : "h-[30px] w-[30px]"
              }`}
            />
          </AvatarFallback>
        </Avatar>
        {isSidebarOpen && (
          <div className="mx-auto text-center flex flex-col text-lg ">
            {adminProfile.name || "Admin"}
            <span className="text-[15px] font-[400px]">
              {adminProfile.role || "admin"}
            </span>
          </div>
        )}
        <nav className="p-4 space-y-1 ">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                isSidebarOpen ? "px-4" : "px-2"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon className="h-10 w-10" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 font-display pt-16 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="p-4 md:p-6">{renderContent()}</div>
      </main>

      {/* Add the dialogs */}
      <ProfileEditDialog
        isOpen={isProfileDialogOpen}
        onClose={closeProfileDialog}
      />
      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onClose={closePasswordDialog}
      />
    </div>
  );
};

export default Dashboard;
