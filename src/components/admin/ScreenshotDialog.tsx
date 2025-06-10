import { Camera, Copy, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScreenshotDialogProps {
  imageUrl: string;
  title: string;
  walletAddress?: string;
}

export const ScreenshotDialog = ({
  imageUrl,
  title,
  walletAddress,
}: ScreenshotDialogProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(walletAddress!);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = title === "Screenshot" ? "screenshot.jpg" : "wallet_qr.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 hover:cursor-pointer text-blue-600"
          title={title || "View Screenshot"}
        >
          {title === "Screenshot" ? (
            <Camera className="h-4 w-4" />
          ) : (
            <QrCode className="h-3 w-3" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title === "Screenshot"
              ? "This is the screenshot sent by user to verify the payment."
              : "This is the user's wallet QR code to receive payment."}
          </DialogDescription>
        </DialogHeader>

        {/* Screenshot Display */}
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-auto max-h-[60vh] object-contain bg-gray-50"
          />
        </div>

        {/* Link and Actions */}
        <div className="flex items-center space-x-2">
          {title !== "Screenshot" && (
            <>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  value={walletAddress}
                  readOnly
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={handleCopyLink}
                title="Copy Link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
