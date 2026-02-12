import React, { useId, useMemo, useState } from "react";

const PrimaryForm = ({
  label,
  children = "Text",
  placeholder,
  className = "",
  labelClassName = "",
  type = "text",
  onChange,
  value: controlledValue,
  defaultValue = "",
  id,
  name,
  required = false,
  disabled = false,
  autoComplete,
  inputMode,
}) => {
  const reactId = useId();
  const inputId = useMemo(() => id || name || `primary-input-${reactId}`, [id, name, reactId]);

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    if (!isControlled) setUncontrolledValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const value = isControlled ? controlledValue : uncontrolledValue;
  const showLabel = focused || value.length > 0;
  const inputPlaceholder = placeholder ?? children;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-black font-medium mb-2 ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            placeholder={showLabel ? "" : inputPlaceholder}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className="
              w-full 
              rounded
              px-4
              py-3
              text-gray-800 
              border 
              border-gray-300
              transition-all 
              duration-200 
              outline-none
              focus:ring-2 
              focus:ring-black
              focus:border-black
              text-base
              bg-white
              hover:border-gray-400
              placeholder-gray-500
            "
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryForm;
