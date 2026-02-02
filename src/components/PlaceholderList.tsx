import React from 'react';

interface PlaceholderListProps {
  placeholders: string[];
  values: Record<string, string>;
  onValueChange: (placeholder: string, value: string) => void;
}

export const PlaceholderList: React.FC<PlaceholderListProps> = ({ placeholders, values, onValueChange }) => {
  if (placeholders.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">2. Fill in the values</h2>
      <div className="space-y-4">
        {placeholders.map(p => (
          <div key={p}>
            <label htmlFor={p} className="block text-sm font-medium text-gray-700 capitalize">{p.replace(/_/g, ' ')}</label>
            <input
              type="text"
              id={p}
              value={values[p] || ''}
              onChange={(e) => onValueChange(p, e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};