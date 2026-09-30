"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "bottom" | "top" | "left" | "right" | "fade";
}

export function ImageReveal({
  children,
  className = "",
  delay = 0,
  duration = 1.0,
  direction = "bottom",
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case "bottom":
        return { y: 28, opacity: 0 };
      case "top":
        return { y: -28, opacity: 0 };
      case "left":
        return { x: 28, opacity: 0 };
      case "right":
        return { x: -28, opacity: 0 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative ${className}`}
    >
      <motion.div
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: duration * 1.25,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
