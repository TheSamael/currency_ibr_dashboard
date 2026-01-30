import { API_KEY, API_BASE_URL } from '../constants';
import { ExchangeRateResponse } from '../types';

export const fetchRates = async (): Promise<ExchangeRateResponse> => {
  // Always fetch USD base as per requirements to cache and recalculate locally
  const url = `${API_BASE_URL}/${API_KEY}/latest/USD`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const data: ExchangeRateResponse = await response.json();
  
  if (data.result !== 'success') {
    throw new Error('Failed to retrieve exchange rates from API provider.');
  }
  
  return data;
};