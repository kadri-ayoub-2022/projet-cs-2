import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface InputProps {
  label?: string;
  type: string;
  value: string;
  name?:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, type, value,name, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isSearch = type === "search";

  return (
    <div className="relative w-full">
      {label && <p className="font-medium text-sm mb-1">{label}</p>}
      <input
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-3 mt-1 rounded-md shadow-sm border-2 border-[#2E86FB] bg-white focus:outline-none w-full pr-10"
        required
        name={name ?? ""}
      />
      {isPassword && (
        <span
          className="absolute top-12 right-4 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      {isSearch && (
        <span className="absolute top-6 right-4 text-gray-500">
          <FaSearch />
        </span>
      )}
    </div>
  );
};

export default Input;