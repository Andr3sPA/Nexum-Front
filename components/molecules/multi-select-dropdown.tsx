import React from 'react';
import { Input } from '@/components/atoms/input';

interface MultiSelectDropdownProps {
  items: { id: number; name: string }[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
  placeholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onEnterKey?: (availableItems: { id: number; name: string }[]) => void;
  className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedIds,
  onSelect,
  onRemove,
  placeholder,
  searchValue,
  onSearchChange,
  showDropdown,
  setShowDropdown,
  onEnterKey,
  className = '',
}) => {
  const availableItems = items.filter(
    (item) => !selectedIds.includes(item.id) && item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={`mt-2 ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnterKey) {
              onEnterKey(availableItems);
            }
          }}
          className="w-full"
        />
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {availableItems.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onSelect(item.id);
                  onSearchChange('');
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedIds.map((id) => {
          const item = items.find((i) => i.id === id);
          return item ? (
            <div key={id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {item.name}
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};