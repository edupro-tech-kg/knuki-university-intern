import React from "react";
import { FaArrowRight } from "react-icons/fa6";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium text-lg px-8 py-3 transition-all duration-300";

  const variants = {
    primary: `
      border border-white text-white rounded-full
      hover:bg-white hover:text-black 
      active:scale-95
      disabled:border-[#C5C9D1] disabled:text-[#C5C9D1] disabled:bg-transparent
      disabled:cursor-not-allowed
    `,
    primaryIcon: `
      border border-white text-white rounded-full
      hover:bg-white hover:text-black
      active:scale-95
      disabled:border-[#C5C9D1] disabled:text-[#C5C9D1] disabled:bg-transparent
      disabled:cursor-not-allowed
    `,
    secondary: `
      bg-[#A22220] text-white rounded
      hover:bg-[#751715]
      active:scale-95
      disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]
      disabled:cursor-not-allowed
    `,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}

      {variant === "primaryIcon" && <FaArrowRight size={18} />}
    </button>
  );
};

export default Button;
