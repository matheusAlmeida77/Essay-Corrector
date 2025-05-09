import { useState } from "react";

export interface ComboboxOption {
  label: string;
  value: string;
  class: string;
  number: number;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  disabled = false,
  searchable = true,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full p-3 border rounded-lg text-left shadow-sm hover:border-gray-400 focus:outline-none transition-colors"
      >
        {selectedOption ? (
          <div>
            <div className="font-medium">{selectedOption.label}</div>
            <div className="text-sm text-gray-500">{selectedOption.class}</div>
            <div className="text-sm text-gray-500">
              N: {selectedOption.number}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="absolute mt-2 w-full border rounded-lg bg-background shadow-lg z-10">
          {searchable && (
            <input
              type="text"
              className="w-full bg-background p-3 border-b"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <li className="p-3 text-gray-500">Sem resultados.</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.class}</div>
                  <div className="text-sm text-gray-500">
                    N: {option.number}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
