import axios, { AxiosError } from "axios";

interface SendCurrencyResponse {
  message: string;
  data: {
    _id: string;
    amount: number;
    wallet: string;
    walletID: string;
    status: string;
    screenshot: string;
    createdAt: string;
  };
}

export const sendCurrencyService = {
  async createSendRequest(formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post<SendCurrencyResponse>(
        `${import.meta.env.VITE_URL}/send-currency`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to send currency"
        );
      }
      // Handle other errors
      throw new Error("An unexpected error occurred");
    }
  },

  async updateStatus(id: string, status: string, remark: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_URL}/send-currency/${id}`,
        { status, remark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to update status"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  },

  async getAdminWallets() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login again");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/admin/wallets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.wallets;
    } catch (error) {
      console.error("Error fetching admin wallets:", error);
      throw error;
    }
  },
};
