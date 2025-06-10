import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyButton = ({ textToCopy, className = "" }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`relative group flex items-center justify-center p-2 rounded-md 
          transition-all duration-200 ease-in-out
          hover:bg-gray-700/50 active:scale-95 ${className}`}
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500 transition-all duration-200" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400 transition-all duration-200" />
        )}

        {/* Tooltip */}
        <span
          className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 
            text-xs font-medium text-white bg-gray-900 rounded-md 
            transition-all duration-200 
            ${
              copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    </div>
  );
};

export default CopyButton;
