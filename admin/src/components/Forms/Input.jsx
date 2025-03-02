import React from "react";

const Input = ({
  label,        
  type = "text", 
  placeholder,    
  value,          
  onChange,   
  error,      
  success,  
  icon,      
  className = "", 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          htmlFor={label}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center border rounded-lg transition-all ${
          error
            ? "border-red-500"
            : success
            ? "border-green-500"
            : "border-gray-300 dark:border-gray-600"
        } focus-within:ring-2 ${
          error
            ? "focus-within:ring-red-500"
            : success
            ? "focus-within:ring-green-500"
            : "focus-within:ring-blue-500"
        }`}
      >
        {icon && (
          <span className="pl-3 text-gray-400 dark:text-gray-500">
            <i className={`fas fa-${icon}`} />
          </span>
        )}
        <input
          type={type}
          id={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex-1 p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none rounded-lg ${
            icon ? "pl-2" : "pl-3"
          }`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">
          <i className="fas fa-exclamation-circle mr-1" />
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-500 mt-1">
          <i className="fas fa-check-circle mr-1" />
          {success}
        </p>
      )}
    </div>
  );
};

export default Input;
