/** Premium price in USD. */
export const PREMIUM_PRICE_USD = 50;

/**
 * The crypto token accepted for premium payments.
 * Swap these constants to accept a different coin.
 */
export const PAYMENT_TOKEN = {
  symbol: "SOL",
  name: "Solana",
  network: "Solana Mainnet",
  /** Mock exchange rate — a real integration would fetch this live. */
  usdRate: 148.2,
  /** Mock merchant wallet address. */
  merchantAddress: "KDN7xQfz9mWpVvGhLcRt4eYuBsA2nJk5PqXoZbHi8MEw",
  networkFee: 0.000005,
} as const;

export function usdToToken(usd: number): number {
  return usd / PAYMENT_TOKEN.usdRate;
}

export function formatToken(amount: number): string {
  return amount.toFixed(4);
}

const BASE58_CHARS =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Generates a realistic-looking mock Solana transaction signature. */
export function mockTransactionSignature(): string {
  let signature = "";
  for (let i = 0; i < 88; i++) {
    signature += BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)];
  }
  return signature;
}
