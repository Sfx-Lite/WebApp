import { motion } from "motion/react";

type Step = { label: string };

const STEPS: Step[] = [
  { label: "Login details" },
  { label: "Pin verification" },
  { label: "Welcome to SFx money app" },
];

type RegistrationTimelineMobileProps = {
  currentStep?: number;
  className?: string;
};

export default function RegistrationTimelineMobile({
  currentStep = 0,
  className = "",
}: RegistrationTimelineMobileProps) {
  return (
    <div className={`flex gap-1.5 w-[30%] ${className}`}>
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        const isFilled = isActive || isDone;

        return (
          <div
            key={step.label}
            style={{ flexGrow: isFilled ? 2 : 1 }}
            className="relative h-1.5 flex-shrink-0 rounded-full bg-sfx-muted/20 overflow-hidden transition-[flex-grow] duration-300 ease-out"
          >
            <motion.div
              initial={false}
              animate={{ scaleX: isFilled ? 1 : 0 }}
              transition={{
                delay: isFilled ? index * 0.12 : 0,
                duration: 0.35,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "left" }}
              className="absolute inset-0 rounded-full bg-sfx-primary"
            />
          </div>
        );
      })}
    </div>
  );
}
