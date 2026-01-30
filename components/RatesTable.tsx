import React from 'react';
import { IBRRate } from '../types';
import { formatRate } from '../utils/currency';

interface RatesTableProps {
  rates: IBRRate[];
  baseCurrency: string;
}

export const RatesTable: React.FC<RatesTableProps> = ({ rates, baseCurrency }) => {
  if (rates.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
        No rates found. Try adjusting your filter or refreshing the data.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider w-32">
              Code
            </th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider">
              Currency
            </th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right w-48">
              IBR ({baseCurrency})
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rates.map((rate) => (
            <tr key={rate.code} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-900 font-mono">
                {rate.code}
              </td>
              <td className="px-6 py-3 text-gray-600">
                {rate.name}
              </td>
              <td className="px-6 py-3 text-right font-mono font-medium text-blue-700">
                {formatRate(rate.rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};