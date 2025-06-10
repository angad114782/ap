import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

interface Plan {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  durationDays: number;
  isActive: boolean;
}

interface PlanDialogProps {
  plan?: Plan | null;
  isEdit?: boolean;
  onSuccess?: () => void;
}
// Replace CreatePlanDialog with this new component
const PlanDialog = ({
  plan = null,
  isEdit = false,
  onSuccess,
}: PlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    minAmount: plan?.minAmount || "",
    maxAmount: plan?.maxAmount || "",
    roi: plan?.roi || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && plan?._id) {
        await axios.put(
          `${import.meta.env.VITE_URL}/plans/${plan._id}`,
          formData
        );
        toast.success("Plan updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_URL}/plans`, formData);
        toast.success("Plan created successfully");
      }
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(
        "Error: " + (error.response?.data?.message || "Failed to save plan")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto text-xs md:text-sm"
          >
            Edit
          </Button>
        ) : (
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Investment Plan" : "Create New Investment Plan"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify the details of the investment plan."
              : "Fill in the details for the new investment plan."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter plan name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minAmount">Min Amount ($)</Label>
                <Input
                  id="minAmount"
                  name="minAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.minAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxAmount">Max Amount ($)</Label>
                <Input
                  id="maxAmount"
                  name="maxAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.maxAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="roi">ROI (%)</Label>
                <Input
                  id="roi"
                  name="roi"
                  type="number"
                  placeholder="0"
                  value={formData.roi}
                  onChange={handleChange}
                  required
                />
              </div>
            
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : isEdit
                ? "Save Changes"
                : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/plans`);
      setPlans(response.data.plans);
    } catch (error: any) {
      toast.error(
        "Error fetching plans: " +
          (error.response?.data?.message || "Failed to load plans")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem("token"); // Get auth token
      await axios.patch(
        `${import.meta.env.VITE_URL}/plans/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlans(); // Refresh plans after toggle
      toast.success("Plan status updated successfully");
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please login again");
      } else if (error.response?.status === 403) {
        toast.error("Access denied: Admin privileges required");
      } else {
        toast.error(
          "Error updating plan status: " +
            (error.response?.data?.message || "Failed to update status")
        );
      }
    }
  };

  const handleDeletePlan = async (id: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_URL}/plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please login again");
      } else if (error.response?.status === 403) {
        toast.error("Access denied: Admin privileges required");
      } else {
        toast.error(
          "Error deleting plan: " +
            (error.response?.data?.message || "Failed to delete plan")
        );
      }
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="space-y-2 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Investment Plans</h2>
        <PlanDialog onSuccess={fetchPlans} />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {plans?.map((plan) => (
            <Card key={plan._id} className="w-full">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
                  <CardTitle className="text-base sm:text-lg">
                    {plan.name}
                  </CardTitle>
                  <Badge
                    variant={plan.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1">
                    <div className="text-xs md:text-sm text-gray-500">
                      Min Amount
                    </div>
                    <div className="text-sm md:text-base font-semibold">
                      ${plan.minAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs md:text-sm text-gray-500">
                      Max Amount
                    </div>
                    <div className="text-sm md:text-base font-semibold">
                      ${plan.maxAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs md:text-sm text-gray-500">ROI</div>
                    <div className="text-sm md:text-base font-semibold text-green-600">
                      {plan.roi}%
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <PlanDialog
                    plan={plan}
                    isEdit={true}
                    onSuccess={fetchPlans}
                  />
                  <Button
                    size="sm"
                    variant={plan.isActive ? "destructive" : "default"}
                    className="w-full sm:w-auto text-xs md:text-sm"
                    onClick={async () => {
                      setTogglingId(plan._id);
                      await handleToggleStatus(plan._id);
                      setTogglingId(null);
                    }}
                    disabled={togglingId === plan._id}
                  >
                    {togglingId === plan._id
                      ? "Updating..."
                      : plan.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full sm:w-auto text-xs md:text-sm"
                    onClick={() => {
                      setDeletingId(plan._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => deletingId && handleDeletePlan(deletingId)}
        loading={isDeleting}
      />
    </div>
  );
};

export const renderPlans = Plans;

export default Plans;
