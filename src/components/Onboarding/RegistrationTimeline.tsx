import { motion } from "motion/react";

type Step = { label: string };

const STEPS: Step[] = [
  { label: "Login details" },
  { label: "Pin verification" },
  { label: "Welcome to SFx money app" },
];

type RegistrationTimelineProps = {
  currentStep?: number;
  className?: string;
};

export default function RegistrationTimeline({
  currentStep = 0,
  className = "",
}: RegistrationTimelineProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12, duration: 0.3, ease: "easeOut" }}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.12 + 0.1, duration: 0.25 }}
                className={`h-3 w-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${
                  isActive || isDone
                    ? "bg-sfx-primary border-sfx-primary"
                    : "bg-white border-sfx-muted/40"
                }`}
              />

              {!isLast && (
                <div className="relative w-0.5 flex-1 min-h-[2.5rem] bg-sfx-muted/20 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleY: isDone ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: "top" }}
                    className="absolute inset-0 bg-sfx-primary"
                  />
                </div>
              )}
            </div>

            <span
              className={`pb-8 text-[15px] leading-3 ${
                isActive ? "text-sfx-ink font-rh-sb" : "text-sfx-muted"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
