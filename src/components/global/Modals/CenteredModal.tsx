import type { ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type CenteredModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function CenteredModal({ open, onClose, title, children }: CenteredModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              onClick={e => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-3 bg-white rounded-t-[1.75rem]">
                {title
                  ? <h3 className="font-rh-b text-[17px] text-sfx-ink">{title}</h3>
                  : <span />}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex items-center justify-center size-8 rounded-full bg-sfx-muted/10 text-sfx-muted hover:bg-sfx-muted/20 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
