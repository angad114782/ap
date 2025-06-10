import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ComboboxProps {
  placeholder: string;
  wallets: {
    value: string;
    label: string;
    icon: string | null; // ✅ changed from `string` to `string | null`
    walletID?: string;
  }[];
  onChange?: (value: string, id: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}


const Combobox: React.FC<ComboboxProps> = ({
  placeholder,
  wallets,
  onChange,
  onOpenChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [ID, setID] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedWallet = wallets.find((wallet) => wallet.value === value);

  const toggleOpen = () => {
    const newOpen = !open;
    setOpen(newOpen);
    // Notify parent component when dropdown opens/closes
    onOpenChange?.(newOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleSelect = (wallet: (typeof wallets)[0]) => {
  const newValue = wallet.value === value ? "" : wallet.value;
  const newId = wallet.walletID === ID ? "" : wallet.walletID;
  setValue(newValue);
  setID(newId!);
  onChange?.(wallet.value, wallet.walletID || ""); // ✅ Fixed here
  setOpen(false);
};


  return (
    <div className="flex justify-center w-full" ref={dropdownRef}>
      <div className="relative w-full max-w-[250px]">
        {/* Trigger Button */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onClick={toggleOpen}
          className="group min-w-[230px] h-14 justify-between text-md bg-black border-none text-white hover:text-black w-full flex items-center px-4"
        >
          {selectedWallet ? (
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img
                src={selectedWallet.icon ?? undefined}
                alt=""
                className="h-[55px] w-[55px]"
              />
              <span className="text-white group-hover:text-black">
                {selectedWallet.label.toLocaleUpperCase()}
              </span>
            </div>
          ) : (
            <span className="flex-1 text-center group-hover:text-black">
              {placeholder}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-white group-hover:text-black transition-transform duration-200 ml-2",
              open && "transform rotate-180"
            )}
          />
        </Button>

        {/* Custom Dropdown */}
        {open && (
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full mt-1 bg-[#171717] border border-gray-600 rounded-md shadow-lg z-[9999] overflow-y-auto">
            {wallets.length === 0 ? (
              <div className="p-4 text-center text-white text-sm">
                No crypto found.
              </div>
            ) : (
              wallets.map((wallet, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(wallet)}
                  className="flex items-center gap-3 p-3 hover:bg-[#2a2a2a] cursor-pointer text-white hover:text-black transition-colors"
                >
                  <img
  src={wallet.icon ?? undefined} // ✅ safely fallback to undefined
  alt={wallet.label}
  className="h-8 w-8 flex-shrink-0"
/>

                  <span className="text-md font-medium flex-1">
                    {wallet.label.toLocaleUpperCase()}
                  </span>
                  <Check
                    className={cn(
                      "h-5 w-5 text-green-500 flex-shrink-0",
                      value === wallet.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Combobox;
