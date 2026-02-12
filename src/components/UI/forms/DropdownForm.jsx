import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";

const DropdownForm = ({ fields = [], className = "", labelClassName = "", values, onChange }) => {
  const { t } = useTranslation();
  const select = t("dropdownForm.select");

  const isControlled = values !== undefined;
  const initialValues = useMemo(
    () =>
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || "";
        return acc;
      }, {}),
    [fields]
  );
  const [uncontrolledValues, setUncontrolledValues] = useState(initialValues);
  const currentValues = isControlled ? values : uncontrolledValues;

  const handleChange = (name, value) => {
    if (!isControlled) setUncontrolledValues((prev) => ({ ...prev, [name]: value }));
    const field = fields.find((f) => f.name === name);
    if (field?.onChange) field.onChange(value);
    if (onChange) onChange(name, value);
  };

  return (
    <div className={`w-full ${className}`}>
      {fields.map((field) => (
        <div key={field.name} className="mb-4 w-full">
          {field.label && (
            <label
              htmlFor={field.name}
              className={`block text-black font-medium mb-2 ${labelClassName}`}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">{/* * */}</span>}
            </label>
          )}

          <div className="relative w-full">
            <select
              id={field.name}
              value={currentValues[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={field.disabled}
              required={field.required}
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
                appearance-none
                bg-white
                cursor-pointer
                disabled:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option value="" disabled={field.required}>
                {field.placeholder || select}
              </option>

              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IoIosArrowDown className="text-gray-600 text-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropdownForm;
