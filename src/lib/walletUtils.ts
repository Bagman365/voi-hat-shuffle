
/**
 * Format a wallet address for display by truncating the middle
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 8) return address;
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

/**
 * Format an asset balance with proper decimal places
 */
export const formatAssetBalance = (balance: number, decimals: number = 6): string => {
  return (balance / Math.pow(10, decimals)).toFixed(decimals);
};
