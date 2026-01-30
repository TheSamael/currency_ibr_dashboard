import { ExchangeRateResponse, IBRRate } from '../types';

const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

export const getCurrencyName = (code: string): string => {
  try {
    return currencyNames.of(code) || code;
  } catch (e) {
    return code;
  }
};

/**
 * Calculates the IBR (Interbank Rate).
 * IBR = Base Currency Rate (relative to USD) / Target Currency Rate (relative to USD)
 * 
 * Example: Base INR, Target EUR.
 * API (USD Base): USD=1, INR=83, EUR=0.92
 * Calculation: 83 / 0.92 = 90.21 (How many INR to buy 1 EUR)
 */
export const calculateIBRRates = (
  data: ExchangeRateResponse | null,
  baseCurrencyCode: string,
  filterText: string
): IBRRate[] => {
  if (!data || !data.conversion_rates) return [];

  const usdToBaseRate = data.conversion_rates[baseCurrencyCode];
  
  if (usdToBaseRate === undefined) {
    console.error(`Base currency ${baseCurrencyCode} not found in rates.`);
    return [];
  }

  // Parse filter text
  const filters = filterText
    .toUpperCase()
    .split(/[\s,]+/) // Split by comma, space, newline
    .filter(code => code.length > 0); // Remove empty strings

  const rates: IBRRate[] = Object.entries(data.conversion_rates)
    .map(([targetCode, usdToTargetRate]) => {
      // Avoid division by zero
      if (usdToTargetRate === 0) return null;

      // Logic: (USD -> Base) / (USD -> Target)
      const ibr = usdToBaseRate / usdToTargetRate;

      return {
        code: targetCode,
        name: getCurrencyName(targetCode),
        rate: ibr
      };
    })
    .filter((item): item is IBRRate => item !== null);

  // Apply Filter
  if (filters.length > 0) {
    return rates.filter(rate => filters.includes(rate.code));
  }

  return rates;
};

export const formatRate = (rate: number): string => {
  return rate.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export const downloadCSV = (rates: IBRRate[], baseCurrency: string) => {
  const headers = ['Code', 'Currency', `IBR (Base: ${baseCurrency})`];
  const rows = rates.map(r => [r.code, r.name, r.rate.toFixed(4)]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IBR_Rates_${baseCurrency}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};