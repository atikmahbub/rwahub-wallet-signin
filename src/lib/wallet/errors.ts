export type WalletStatus =
  | "no-wallet"
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong-network"
  | "rejected"
  | "error";

export class NoWalletError extends Error {}

export const getNormalizedError = (
  error: unknown,
): { code?: number; message: string } => {
  if (typeof error !== "object" || error === null) {
    return { message: "Unknown wallet error" };
  }
  const e = error as any;
  // MetaMask sometimes wraps the real error (ethers / RPC errors)
  const code = Number(e.code ?? e.error?.code ?? e.data?.originalError?.code);
  return {
    code: Number.isFinite(code) ? code : undefined,
    message: e.message ?? e.error?.message ?? "Unknown wallet error",
  };
};

export const toWalletError = (error: unknown) => {
  if (error instanceof NoWalletError) {
    return {
      status: "no-wallet" as const,
      message: "MetaMask is not installed in this browser.",
    };
  }

  const { code, message } = getNormalizedError(error);
  const msg = message.toLowerCase();

  if (code === 4001 || msg.includes("user rejected")) {
    return {
      status: "rejected" as const,
      message: "You cancelled the request in MetaMask.",
    };
  }
  if (code === -32002) {
    return {
      status: "error" as const,
      message:
        "MetaMask already has a pending request. Open the extension to finish it.",
    };
  }
  if (msg.includes("timed out")) {
    return {
      status: "error" as const,
      message: "MetaMask did not respond. Open the extension and try again.",
    };
  }
  return {
    status: "error" as const,
    message: "Could not connect to your wallet. Please try again.",
  };
};
