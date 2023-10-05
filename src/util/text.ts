const percentFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatPercent = (n: number): string => {
  return `${percentFormatter.format(n * 100)}%`;
}

const currencyFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
const smallCurrencyFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 4, style: 'currency', currency: 'USD' });
export const formatCurrency = (n: number): string => {
  if (n < 10) {
    return smallCurrencyFormatter.format(n);
  }
  return currencyFormatter.format(n);
}

const floatFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 8 });
export const formatFloat = (n: number): string => {
  return `${floatFormatter.format(n)}`;
}