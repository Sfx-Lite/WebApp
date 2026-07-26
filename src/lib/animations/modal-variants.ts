import type { Variants } from "motion";

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export const desktopPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 30, mass: 0.7 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { type: "spring", stiffness: 400, damping: 32 },
  },
};

export const sheetPanelVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 34, mass: 0.8 },
  },
  exit: {
    y: "100%",
    transition: { type: "spring", stiffness: 380, damping: 36 },
  },
};
