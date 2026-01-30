import { BaseCurrency } from './types';

export const API_KEY = 'c3fed060ca825ebaa0581a04';
export const API_BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const DEFAULT_BASE_CURRENCY = BaseCurrency.INR;

export const SUPPORTED_BASE_CURRENCIES: BaseCurrency[] = [
  BaseCurrency.INR,
  BaseCurrency.USD,
  BaseCurrency.EUR,
  BaseCurrency.GBP,
  BaseCurrency.AED,
  BaseCurrency.CAD,
  BaseCurrency.SGD,
  BaseCurrency.AUD,
  BaseCurrency.JPY,
];

export const TABLE_HEADERS = ['Code', 'Currency', 'IBR'];