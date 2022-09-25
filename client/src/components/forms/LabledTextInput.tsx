import React from "react";

export const LabledTextInput = ({
  needsFill = false,
  className = "",
  label = "",
  value = "",
  onChange = (event: any): void => {},
  name = "",
  type = "",
  placeholder = "",
  charLimit = 50,
  required = false,
}) => {
  const onInputChange = (event: any) => {
    const value = event.target.value;
    if (value.length > charLimit) {
      return;
    } else {
      onChange(event);
    }
  };

  const inputClass = `shadow-sm appearance-none border ${
    needsFill ? "border-red-600" : "border-gray-300 hover:border-gray-500"
  }  text-sm text-gray-700 rounded w-full h-auto py-2 px-3 font-light leading-tight focus:outline-none  focus:border-gray-500`;
  return (
    <div className={`${className}`}>
      {label && (
        <label
          className={`block select-none font-medium text-sm mb-1 ${
            needsFill ? "text-red-600" : "text-black"
          }`}
        >
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}

      <input
        value={value}
        onChange={onInputChange}
        name={name}
        type={type}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );
};
