import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export const ProfileEditDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    email: "",
  });

  // ✅ Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFormData({
          fullName: data.name || "",
          contactNo: data.mobile || "",
          email: data.email || "",
        });
        if (data.profilePic) {
          const baseUrl = import.meta.env.VITE_URL.split("/api")[0];
          setSelectedImage(`${baseUrl}${data.profilePic}`);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Unable to load profile");
      }
    };

    if (isOpen) fetchProfile();
  }, [isOpen]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const updateForm = new FormData();
    updateForm.append("name", formData.fullName);
    updateForm.append("email", formData.email);
    updateForm.append("mobile", formData.contactNo);
    if (imageFile) {
      updateForm.append("profilePic", imageFile);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updateForm,
      });

      if (!response.ok) throw new Error("Update failed");
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error("Update Error", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-300" />

        <div className="px-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="flex items-center justify-between -mt-10 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  <img
                    src={selectedImage || ""}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md bg-white hover:bg-gray-50"
                    onClick={handleImageClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.fullName || "Admin"}
                </h2>
                <p className="text-gray-600">Admin</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-800 font-medium">Full Name</Label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Your Full Name"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">Contact Number</Label>
                <Input
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                  placeholder="Your Contact Number"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-gray-800 font-medium">Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your Email Address"
                  className="mt-2 bg-gray-100 border-0 focus:bg-white"
                />
              </div>
            </div>

            <DialogFooter className="pb-6 px-0">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
