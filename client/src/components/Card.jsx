import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Card = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:border-black/10 hover:shadow-xl hover:shadow-black/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
