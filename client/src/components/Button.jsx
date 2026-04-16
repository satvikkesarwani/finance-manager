import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Button = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/30",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm",
    ghost: "bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold shadow-sm",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    outline: "bg-white border-2 border-slate-300 hover:border-brand-primary hover:bg-brand-primary/5 text-slate-700 hover:text-brand-primary shadow-sm",
  };

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
