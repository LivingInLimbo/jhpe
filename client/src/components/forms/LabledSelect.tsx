import React from "react";
import { IoChevronDownSharp } from "react-icons/io5";

const inputClass =
  "shadow-sm cursor-pointer bg-white appearance-none  border border-gray-300 text-sm text-gray-700 rounded w-full py-2 px-3 font-light leading-tight focus:outline-none hover:border-gray-500 ";

type props = {
  className?: string;
  name?: string;
  defaultValue?: string | number;
  onChange?: any;
  disabled?: boolean;
  required?: boolean;
  list: any[];
  valueId: string;
  nameId: string;
  label?: string;
  margin?: string;
};

export const LabledSelect = ({
  className = "",
  name = "",
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  list = [],
  valueId = "",
  nameId = "",
  label = "",
  margin = "mb-4",
}: props) => (
  <div className={`${className} ${margin}`}>
    <label className="block font-medium text-sm mb-1">
      {label}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        className={inputClass}
        disabled={disabled}
      >
        {list.map((item, i) => {
          return (
            <option key={i} value={item[valueId]}>
              {item[nameId]}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <IoChevronDownSharp size={15} />
      </div>
    </div>
  </div>
);
