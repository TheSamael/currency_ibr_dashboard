export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export interface IBRRate {
  code: string;
  name: string;
  rate: number;
}

export enum BaseCurrency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AED = 'AED',
  CAD = 'CAD',
  SGD = 'SGD',
  AUD = 'AUD',
  JPY = 'JPY'
}