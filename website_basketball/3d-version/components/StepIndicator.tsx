import React from "react";

interface StepIndicatorProps {
  currentStep: "upload" | "analyze" | "results";
}

const steps = [
  { key: "upload", label: "Upload" },
  { key: "analyze", label: "Analyze" },
  { key: "results", label: "Results" },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  return (
    <nav aria-label="Progress" className="w-full max-w-xl mx-auto my-6">
      <ol className="flex items-center justify-center gap-4">
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          return (
            <li key={step.key} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  isActive
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isCompleted
                    ? "bg-orange-200 border-orange-400 text-orange-800"
                    : "bg-gray-800 border-gray-600 text-gray-400"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive
                    ? "text-orange-400"
                    : isCompleted
                    ? "text-orange-300"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-8 h-1 bg-gray-600 mt-2 mb-2 rounded-full" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator; 