interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function StepIndicator({ steps, current, className = '' }: StepIndicatorProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            {/* Step circle */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-semibold ${isActive ? 'text-primary' : isCompleted ? 'text-sidebar' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-gray-400">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mx-3">
                <div className={`h-0.5 rounded-full transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
