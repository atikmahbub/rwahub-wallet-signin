import { useState } from "react";
import { Check, Copy, LogOut } from "lucide-react";
import { getTargetNetwork, useAuthStore } from "@/store/authStore";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  31337: "Hardhat Local",
  50002: "Pharos Devnet",
};

const shortAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export const WalletStatusCard = () => {
  const wallet = useAuthStore((state) => state.user?.wallet);
  const switchToPharos = useAuthStore((state) => state.switchToPharos);
  const logout = useAuthStore((state) => state.logout);
  const [copied, setCopied] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!wallet?.address) {
    return null;
  }

  const target = getTargetNetwork();
  const onTarget = wallet.chainId === target.chainId;
  const networkName = wallet.chainId
    ? (CHAIN_NAMES[wallet.chainId] ?? `Chain ${wallet.chainId}`)
    : "Unknown network";

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Failed to copy address to clipboard");
    }
  };

  const handleSwitch = async () => {
    setSwitching(true);
    await switchToPharos();
    setSwitching(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 min-w-[240px]">
      <div className="flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={copyAddress}
          title={copied ? "Copied" : "Copy address"}
          className="group flex items-center gap-2 font-mono text-sm text-gray-900"
        >
          {shortAddress(wallet.address)}
          {copied ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <Copy
              size={14}
              className="text-gray-400 group-hover:text-gray-600"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => logout()}
          title="Disconnect"
          aria-label="Disconnect wallet"
          className="text-gray-400 hover:text-red-600"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={`h-2 w-2 rounded-full ${onTarget ? "bg-green-500" : "bg-amber-500"}`}
          aria-hidden="true"
        />
        <span className="text-gray-600">{networkName}</span>
        {!onTarget && (
          <button
            type="button"
            onClick={handleSwitch}
            disabled={switching}
            className="ml-auto font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {switching
              ? "Check MetaMask…"
              : `Switch to ${target.config.chainName}`}
          </button>
        )}
      </div>
    </div>
  );
};
