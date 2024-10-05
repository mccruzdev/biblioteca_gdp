import { useState } from "react";

interface BaseInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export default function BaseInput({
  handleInputChange,
  value,
  name,
  label,
  placeholder,
  type = "text",
  required = true,
}: BaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6 flex">
      <input
        id={name}
        type={type}
        name={name}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-none focus:ring-2 focus:outline-gray-400"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder={placeholder}
      />
      <label
        htmlFor={name}
        className={`absolute left-3 top-2 -translate-y-6 scale-90 text-black transition-all duration-300 transform bg-white px-1 ${
          isFocused || value ? "" : "text-gray-500"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}
