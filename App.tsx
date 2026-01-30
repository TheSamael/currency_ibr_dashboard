import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchRates } from './services/api';
import { ExchangeRateResponse, BaseCurrency } from './types';
import { calculateIBRRates, downloadCSV } from './utils/currency';
import { RatesTable } from './components/RatesTable';
import { SUPPORTED_BASE_CURRENCIES, DEFAULT_BASE_CURRENCY } from './constants';
import { ArrowDownTrayIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function App() {
  const [data, setData] = useState<ExchangeRateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  
  const [baseCurrency, setBaseCurrency] = useState<string>(DEFAULT_BASE_CURRENCY);
  const [filterText, setFilterText] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRates();
      setData(result);
      setLastFetched(new Date());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching rates.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute rates locally without re-fetching
  const visibleRates = useMemo(() => {
    return calculateIBRRates(data, baseCurrency, filterText);
  }, [data, baseCurrency, filterText]);

  const handleExport = () => {
    downloadCSV(visibleRates, baseCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                $
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Currency IBR Dashboard</h1>
            </div>
            {lastFetched && (
               <span className="hidden sm:block text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                Updated: {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3" role="alert">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        {/* Control Panel */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Base Currency */}
            <div className="md:col-span-3">
              <label htmlFor="base-currency" className="block text-sm font-semibold text-gray-700 mb-2">
                Base Currency
              </label>
              <select
                id="base-currency"
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-shadow"
              >
                {SUPPORTED_BASE_CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Calculate rates relative to {baseCurrency}.
              </p>
            </div>

            {/* Filter Text Area */}
            <div className="md:col-span-6">
              <label htmlFor="filter-currencies" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter Currencies
              </label>
              <textarea
                id="filter-currencies"
                rows={1}
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none h-[46px] overflow-hidden focus:h-24 focus:overflow-auto transition-all duration-300"
                placeholder="Paste codes here (e.g. USD, EUR, GBP)..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to show all. Separated by commas or spaces.
              </p>
            </div>

            {/* Fetch Button */}
            <div className="md:col-span-3 flex items-start pt-7 md:pt-0 md:items-end justify-end h-full">
               <button
                onClick={loadData}
                disabled={loading}
                className={`w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all flex items-center justify-center gap-2 shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Fetching...' : 'Get Latest IBR Rates'}
              </button>
            </div>
          </div>
        </section>

        {/* Data Table Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-gray-800">Exchange Rates</h2>
             <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
               Showing {visibleRates.length} currencies
             </span>
          </div>

          <RatesTable rates={visibleRates} baseCurrency={baseCurrency} />
        </section>

      </main>

      {/* Footer / Sticky Actions */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleExport}
          disabled={visibleRates.length === 0}
          className="group flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-medium rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <ArrowDownTrayIcon className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default App;