import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface EditableRemarksProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  isEditing: boolean;
  className?: string;
}

const EditableRemarks: React.FC<EditableRemarksProps> = ({
  initialValue,
  onSave,
  isEditing,
  className = "",
}) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave(value);
    } catch (error) {
      console.error("Failed to save remarks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return <span className={className}>{value || "No remarks"}</span>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter remarks"
        className={className}
        disabled={isSubmitting}
      />
      <Button type="submit" size="sm" disabled={isSubmitting}>
        Save
      </Button>
    </form>
  );
};

export default EditableRemarks;
