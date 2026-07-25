import type { PanInfo } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { desktopPanelVariants, overlayVariants, sheetPanelVariants } from "@/lib/animations/modal-variants";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  showDragHandle?: boolean;
};

const DRAG_CLOSE_OFFSET = 120;
const DRAG_CLOSE_VELOCITY = 500;

export default function DefaultModal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  showDragHandle = true,
}: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    if (!isOpen)
      return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > DRAG_CLOSE_OFFSET || info.velocity.y > DRAG_CLOSE_VELOCITY) {
      onClose();
    }
  };

  if (typeof document === "undefined")
    return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          {isDesktop
            ? (
                <div className="flex min-h-full items-center justify-center p-6">
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    variants={desktopPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-[420px] rounded-card bg-white p-(--spacing-card-pad) shadow-2xl"
                  >
                    {children}
                  </motion.div>
                </div>
              )
            : (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  variants={sheetPanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={handleDragEnd}
                  onClick={e => e.stopPropagation()}
                  className="fixed inset-x-0 bottom-0 rounded-t-[1.75rem] bg-white pt-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                >
                  {showDragHandle && (
                    <div className="flex justify-center pb-4 touch-none">
                      <span className="h-1.5 w-10 rounded-full bg-sfx-muted/30" />
                    </div>
                  )}
                  {children}
                </motion.div>
              )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
