import { useId, useMemo, useState } from "react";

const TextAreaForm = ({
  className,
  classTextarea,
  label,
  placeholder,
  id,
  name,
  value: controlledValue,
  defaultValue = "",
  onChange,
  required = false,
  disabled = false,
}) => {
  const reactId = useId();
  const textareaId = useMemo(
    () => id || name || `primary-textarea-${reactId}`,
    [id, name, reactId]
  );
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  return (
    <div className={`${className} w-full mt-8`}>
      <label htmlFor={textareaId} className="w-full ">
        <p className="text-[#0D0D0D] text-lg font-normal mb-[18px]">{label}</p>
        <textarea
          className={` ${classTextarea} w-full resize-y max-h-36 px-3 py-5 rounded-lg border border-[#EEEEEE]  outline-none focus:border-black focus:ring-black focus:ring-2 duration-150 transition-all  `}
          value={value}
          onChange={(e) => {
            if (!isControlled) setUncontrolledValue(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          placeholder={placeholder}
          rows={5}
          id={textareaId}
          name={name}
          required={required}
          disabled={disabled}
        ></textarea>
      </label>
    </div>
  );
};

export default TextAreaForm;
