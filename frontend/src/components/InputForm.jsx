import { FiActivity, FiCpu, FiDroplet, FiHash, FiThermometer, FiZap } from "react-icons/fi";
import { GiPressureCooker } from "react-icons/gi";

export default function InputForm({
  fieldConfig,
  form,
  formErrors,
  formError,
  loading,
  onChange,
  onSubmit,
  onClear,
}) {


  const iconMap = {
    Machine_ID: FiHash,
    Temperature: FiThermometer,
    Pressure: GiPressureCooker,
    Vibration: FiActivity,
    Humidity: FiDroplet,
    Power_Consumption: FiZap,
  };
  
  const hasErrors = fieldConfig.some((f) => {
    const value = form[f.key];
    if (value === "") return true;
    const num = Number(value);
    if (Number.isNaN(num)) return true;
    return num < f.min || num > f.max;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Machine Inputs</h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Enter sensor readings to estimate failure probability and risk level.
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold border border-indigo-100">
          All fields required
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {fieldConfig.map((f) => {
          const hasError = !!formErrors[f.key];
          const hasValue = form[f.key] !== "";
          const Icon = iconMap[f.key] || FiCpu;
          return (
            <div key={f.key} className="relative">
              <label 
                htmlFor={f.key}
                className="block font-semibold mb-2 text-slate-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="text-slate-500" size={16} />
                  {f.label}
                </span>
                <span className="text-xs text-slate-500 ml-2 font-normal">({f.help})</span>
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${hasError ? "text-red-500" : hasValue ? "text-emerald-500" : "text-slate-400"}`}>
                  <Icon size={18} />
                </span>
                <input
                  id={f.key}
                  type="number"
                  name={f.key}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={onChange}
                  disabled={loading}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    hasError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : hasValue
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                />
                {hasValue && !hasError && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">
                    ✓
                  </span>
                )}
              </div>
              {hasError && (
                <p className="text-sm text-red-600 mt-1">
                  {formErrors[f.key]}
                </p>
              )}
              {!hasError && hasValue && (
                <p className="text-xs text-slate-500 mt-1">
                  Valid range: {f.min} - {f.max}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {formError && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-red-700 font-semibold">{formError}</p>
        </div>
      )}

      <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onSubmit}
          // disabled={loading || hasErrors}
          className="px-10 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Processing..." : "Analyze & Predict"}
        </button>
        <button
          onClick={onClear}
          disabled={loading}
          className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
