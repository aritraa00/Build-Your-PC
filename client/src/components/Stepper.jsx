import { BUILD_STEPS } from "../utils/builder";

export const Stepper = ({ currentStep, onChange }) => (
  <div className="glass-panel mb-6 flex flex-wrap gap-3 p-4">
    {BUILD_STEPS.map((step, index) => {
      const isActive = currentStep === index;

      return (
        <button
          key={step.key}
          type="button"
          onClick={() => onChange(index)}
          className={`rounded-2xl px-4 py-3 text-left transition ${
            isActive ? "bg-sky-400/20 text-sky-200 shadow-glow" : "bg-slate-900/80 text-slate-400 hover:text-white"
          }`}
        >
          <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">
            Step {index + 1}
          </span>
          <span className="block text-sm font-medium">{step.label}</span>
        </button>
      );
    })}
  </div>
);

