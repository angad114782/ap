interface Plan {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  durationDays: number;
  isActive: boolean;
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface SelectComponentProps {
  plans: Plan[];
  selectedPlan: Plan;
  onPlanChange: (plan: Plan) => void;
}

const SelectComponent = ({
  plans,
  selectedPlan,
  onPlanChange,
}: SelectComponentProps) => {
  return (
    <Select
      value={selectedPlan._id}
      onValueChange={(val) => {
        const selected = plans.find((p) => p._id === val);
        if (selected) onPlanChange(selected);
      }}
    >
      <SelectTrigger className="w-full px-4 py-6 border border-white rounded-xl bg-transparent text-white">
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold">{selectedPlan.name}</span>
          <span className="text-sm text-gray-300">
            {selectedPlan.roi}% / Day
          </span>
        </div>
      </SelectTrigger>

      <SelectContent className="bg-[#1F1F1F] text-white border w-full">
        <SelectGroup>
          {plans.map((plan) => (
            <SelectItem key={plan._id} value={plan._id} className="p-2">
              {[plan.name, `${plan.roi}% / Day`]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
