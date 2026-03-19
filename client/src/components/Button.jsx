import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Button = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20",
    secondary: "bg-surface-dark hover:bg-surface-dark/80 text-white border border-white/10",
    ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
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
