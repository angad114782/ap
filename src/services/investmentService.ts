import type { InvestorsResponse } from "@/Pages/admin/Investors";
import axios from "axios";

interface CreateInvestmentResponse {
  message: string;
  investment: {
    _id: string;
    userId: string;
    planId: string;
    amount: number;
    roi: number;
    dailyEarning: number;
    totalDays: number;
    startDate: string;
    // status: "active" | "completed" | "cancelled";
  };
}

export const investmentService = {
  async fetchPlans() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/plans`);
      return response.data.plans;
    } catch (error: any) {
      console.error("❌ fetchPlans error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  },
updateStatus: async (userId: string, status: "Active" | "Inactive") => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_URL}/user/status-update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Status update failed");
  }

  return res.json();
},

  async createInvestment(
  planId: string,
  amount: number
): Promise<CreateInvestmentResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please login to continue");
  }

  try {
    const response = await axios.post<CreateInvestmentResponse>(
      `${import.meta.env.VITE_URL}/invest`,
      { planId, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Investment API response:", response.data);

    // ✅ ✅ REMOVE THIS STRICT CHECK:
    // if (!response.data?.investment || typeof response.data.investment.totalDays !== "number") {
    //   throw new Error("Invalid investment data received from server");
    // }

    if (!response.data?.investment) {
      throw new Error("Invalid investment data received from server");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ createInvestment error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again");
    }

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to create investment"
    );
  }
}
,

async fetchInvestments(): Promise<InvestorsResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please login to continue");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL}/admin/all-users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ fetchInvestments error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch investors"
    );
  }
},

};
