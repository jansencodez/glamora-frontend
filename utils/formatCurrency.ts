type Currency = "KSH" | "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | string;

export function formatCurrency(
  amount: number,
  currency: Currency = "KSH",
  locale: string = "en-KE"
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return formatter.format(amount);
}
