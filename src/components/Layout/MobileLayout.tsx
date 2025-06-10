import React from "react";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="fixed inset-0 w-full bg-[#070707] font-display flex justify-center">
      <div
        className="w-full max-w-lg bg-[#070707] shadow-lg flex flex-col overflow-y-auto overflow-x-hidden"
        style={{ height: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
