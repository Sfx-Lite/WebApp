import type { Variants } from "motion";

export const popoverContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
      delayChildren: 0.12,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(6px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const popoverItemVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};
