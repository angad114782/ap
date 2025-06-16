import virat from "@/assets/viratnew.avif";
import EditableRemarks from "@/components/EditableRemarks";
import { ScreenshotDialog } from "@/components/admin/ScreenshotDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownRight, Check, Loader2, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface DataTableProps {
  title: string;
  data: {
    id: string | number;
    type: string;
    plan: string;
    profileName: string;
    profilePic?: string;
    mobile: string;
    amount: string;
    dateTime: Date;
    status: string;
    remarks: string;
    roi?: string;
    screenshot?: string;
    walletQr?: string;
    walletID?: string;
  }[];
  loading?: boolean;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  updateRemarks?: (id: number, remarks: string) => Promise<void>;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

// type UpdateRemarksFunction = (id: number, remarks: string) => Promise<void>;

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "withdrawal":
      return "bg-red-100 text-red-800 border-red-200";
    case "deposit":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Update the MobileCard component to accept editingRemarkId and handleRemarksClick
const MobileCard = ({
  dataColumns,
  title,
  editingRemarkId,
  handleRemarksClick,
  setEditingRemarkId,
  onApprove,
  onReject,
  updateRemarks,
}: {
  dataColumns: DataTableProps["data"][0];
  title: DataTableProps["title"];
  editingRemarkId: number | null;
  handleRemarksClick: (id: number) => void;
  setEditingRemarkId: React.Dispatch<React.SetStateAction<number | null>>;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  updateRemarks?: (id: number, remarks: string) => Promise<void>;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  console.log(dataColumns.screenshot, "datacolumnscreenshot");
  const handleAction = async (action: "approve" | "reject") => {
    try {
      setIsProcessing(true);
      if (action === "approve" && onApprove) {
        await onApprove(String(dataColumns.id));
      } else if (action === "reject" && onReject) {
        await onReject(String(dataColumns.id));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3 shadow-md shadow-gray-100/50 mx-2">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <ArrowDownRight className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-gray-900 truncate">
              {title}
            </h3>
            {/* <p className="text-xs text-gray-500">{title}</p> */}
          </div>
        </div>
        <span
          className={`inline-flex items-center  px-2 py-1 rounded-lg text-xs font-medium ${getStatusStyles(
            dataColumns.status
          )}`}
        >
          {`${
            title === "Investments"
              ? `${dataColumns.roi} %`
              : dataColumns.status
          }`}
        </span>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-white shadow-sm">
            <AvatarImage
              src={
                `${import.meta.env.VITE_URL.slice(0, -4)}${
                  dataColumns?.profilePic
                }` || virat
              }
              alt="User"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
              {dataColumns.profileName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-gray-900 truncate">
              {dataColumns.profileName}
            </h4>
            <p className="text-gray-600 text-xs truncate">
              {dataColumns.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span
            className={`${
              title === "Deposit" ? "hidden" : "block"
            } text-xs font-medium text-gray-500`}
          >
            {title === "Withdrawals"
              ? "Wallet"
              : title === "Transaction"
              ? "WalletId"
              : "Plan"}
          </span>
          <span
            className={`   ${
              title === "Deposit" ? "hidden" : "block"
            } font-bold text-sm text-gray-900 truncate ml-2`}
          >
            {dataColumns.plan}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-500">Amount</span>
          <span className="font-bold text-sm text-green-600 truncate ml-2">
            {dataColumns.amount}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-500">Date</span>
          <span className="font-medium text-sm text-gray-900 truncate ml-2">
            {dataColumns?.dateTime.toDateString()}
          </span>
        </div>

        {/* Move remarks section here and combine with button */}
        {title !== "Transaction" &&
          title !== "Investments" &&
          dataColumns.remarks !== undefined && (
            <div className="flex items-start justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 mt-0.5">
                  Remarks
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 p-0 w-6 h-6 flex items-center justify-center"
                  onClick={() => handleRemarksClick(Number(dataColumns.id))}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 ml-2">
                <EditableRemarks
                  initialValue={dataColumns.remarks}
                  onSave={async (value) => {
                    if (updateRemarks) {
                      await updateRemarks(Number(dataColumns.id), value);
                    }
                    setEditingRemarkId(null);
                  }}
                  className="text-sm text-gray-900 text-right leading-tight"
                  isEditing={editingRemarkId === dataColumns.id}
                />
              </div>
            </div>
          )}
      </div>

      {/* Action Buttons */}
      {title !== "Transaction" && title !== "Investments" && (
        <div className="flex gap-2">
          {dataColumns.status === "Pending" && (
            <>
              <Button
                disabled={isProcessing}
                onClick={() => handleAction("approve")}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Approve"
                )}
              </Button>
              <Button
                disabled={isProcessing}
                onClick={() => handleAction("reject")}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reject"
                )}
              </Button>
            </>
          )}
          {dataColumns?.screenshot && (
            <ScreenshotDialog
              title="Screenshot"
              imageUrl={`${import.meta.env.VITE_URL.slice(
                0,
                -4
              )}/uploads/screenshots/${dataColumns?.screenshot}`}
              walletAddress={dataColumns.walletID}
            />
          )}
          {dataColumns?.walletQr && title === "Withdrawals" && (
            <ScreenshotDialog
              title="Qrcode"
              imageUrl={`${import.meta.env.VITE_URL.slice(0, -4)}/${
                dataColumns.walletQr
              }`}
              walletAddress={dataColumns.walletID}
            />
          )}
        </div>
      )}
    </div>
  );
};

// First, create a proper component instead of just a render function
const DepositComponent = ({
  title,
  data,
  onApprove,
  onReject,
  updateRemarks,
}: DataTableProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [editingRemarkId, setEditingRemarkId] = useState<number | null>(null);
  console.log(data, "vcvcvcvcvcv");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-[50vh]">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // Add this function to handle remarks icon click
  const handleRemarksClick = (id: number) => {
    setEditingRemarkId(editingRemarkId === id ? null : id);
  };

  // Add the handler for remarks updates
  const handleUpdateRemarks = async (id: number, remarks: string) => {
    try {
      if (updateRemarks) {
        await updateRemarks(id, remarks);
        setEditingRemarkId(null);
      }
    } catch (error) {
      console.error("Failed to update remarks:", error);
    }
  };

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {data.map((dataColumns) => (
            <MobileCard
              key={dataColumns.id}
              dataColumns={dataColumns}
              title={title}
              editingRemarkId={editingRemarkId}
              handleRemarksClick={handleRemarksClick}
              setEditingRemarkId={setEditingRemarkId}
              onApprove={onApprove}
              onReject={onReject}
              updateRemarks={handleUpdateRemarks}
            />
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="rounded-md overflow-x-auto">
              <div className="min-w-[1200px] w-full">
                <Table>
                  <TableCaption>A list of your {title}.</TableCaption>
                  <TableHeader className="bg-gray-100 font-bold">
                    <TableRow className="font-extrabold">
                      {title === "Deposit" ? null : <TableHead>Type</TableHead>}
                      <TableHead>
                        {title === "Withdrawals"
                          ? "Wallet"
                          : title === "Transaction"
                          ? "Wallet"
                          : "Plan"}
                      </TableHead>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>
                        {title === "Transaction"
                          ? "Type"
                          : title === "Investments"
                          ? "Roi"
                          : "Status"}
                      </TableHead>
                      {title !== "Transaction" && title !== "Investments" && (
                        <>
                          <TableHead className="w-[200px]">Remarks</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((dataColumns) => (
                      <TableRow key={dataColumns.id}>
                        <TableCell className="font-medium">
                          <ArrowDownRight className="inline h-8 w-8 rounded-full bg-green-500 text-white p-2" />
                        </TableCell>
                        <TableCell
                          className={`${
                            title === "Deposit" ? "hidden" : "block"
                          }`}
                        >
                          {dataColumns.plan}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={dataColumns.profilePic || virat}
                                alt="User"
                                className="object-cover"
                              />
                              <AvatarFallback>
                                {dataColumns.profileName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{dataColumns.profileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{dataColumns.mobile}</TableCell>
                        <TableCell>{dataColumns.amount}</TableCell>
                        <TableCell>
                          {dataColumns.dateTime.toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                              dataColumns.status
                            )}`}
                          >
                            {`${
                              title === "Investments"
                                ? `${dataColumns.roi} %`
                                : dataColumns.status
                            }`}
                          </span>
                        </TableCell>
                        {title !== "Transaction" && title !== "Investments" && (
                          <>
                            <TableCell className="w-[200px] max-w-[200px]">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    handleRemarksClick(Number(dataColumns.id))
                                  }
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <div className="flex-1">
                                  <EditableRemarks
                                    initialValue={dataColumns.remarks}
                                    onSave={async (value) => {
                                      await handleUpdateRemarks(
                                        Number(dataColumns.id),
                                        value
                                      );
                                    }}
                                    className="w-full"
                                    isEditing={
                                      editingRemarkId === dataColumns.id
                                    }
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {dataColumns.status === "Pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-green-600"
                                      title="Approve"
                                      onClick={() =>
                                        onApprove?.(String(dataColumns.id))
                                      }
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600"
                                      title="Reject"
                                      onClick={() =>
                                        onReject?.(String(dataColumns.id))
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {dataColumns.screenshot && (
                                  <ScreenshotDialog
                                    title="Screenshot"
                                    imageUrl={`${import.meta.env.VITE_URL.slice(
                                      0,
                                      -4
                                    )}/uploads/screenshots/${
                                      dataColumns?.screenshot
                                    }`}
                                    walletAddress={dataColumns.walletID}
                                  />
                                )}
                                {dataColumns.walletQr &&
                                  title === "Withdrawals" && (
                                    <ScreenshotDialog
                                      title="Qrcode"
                                      imageUrl={`${import.meta.env.VITE_URL.slice(
                                        0,
                                        -4
                                      )}/${dataColumns.walletQr}`}
                                      walletAddress={dataColumns.walletID}
                                    />
                                  )}
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Then update the render function to use the component
export const renderDashBoardTabs = (props: DataTableProps) => {
  if (props.loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <DepositComponent {...props} />;
};
