import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  min?: string;
  max?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  placeholder,
  icon,
  min,
  max,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex items-center mb-2 text-sm font-medium text-gray-700">
        {icon && <i className={`${icon} w-5 text-center text-blue-500 mr-2`}></i>}
        {label}:
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
      />
    </div>
  );
};

export default FormInput;