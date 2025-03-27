import React from "react";

interface SelectProps {
  label?: string;
  value: string;
  name?: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  name,
  options,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      {label && <p className="font-medium text-sm mb-1">{label}</p>}
      <select
        value={value}
        name={name}
        onChange={onChange}
        className="px-4 py-3.5 mt-1 rounded-md shadow-sm border-2 border-[#2E86FB] bg-white focus:outline-none w-full"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
