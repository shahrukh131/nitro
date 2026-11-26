/** Formats a price the way the design shows it: "12.00 $". */
export function formatPrice(value: number): string {
  return `${value.toFixed(2)} $`;
}
