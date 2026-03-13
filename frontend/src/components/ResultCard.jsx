export default function ResultCard({ result }) {
  if (!result) return null;

  const isFailure = result.prediction === 1;
  const probability = (result.failure_probability * 100).toFixed(1);
  const riskLevel = result.failure_probability >= 0.7 ? "High" : result.failure_probability >= 0.4 ? "Medium" : "Low";

  const handleExport = () => {
    const data = {
      Prediction: result.prediction,
      Status: result.status,
      "Failure Probability": `${probability}%`,
      "Risk Level": riskLevel,
      Timestamp: new Date().toISOString()
    };
    
    const csv = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-result-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className={`mt-8 rounded-2xl shadow-lg border overflow-hidden ${
        isFailure ? "bg-red-600 border-red-500/50" : "bg-emerald-600 border-emerald-500/50"
      } animate-fadeIn`}
      aria-live="polite"
    >
      <div className="p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">Single Prediction</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              {isFailure ? "Failure Risk Detected" : "Machine Operating Normally"}
            </h2>
            <p className="text-sm text-white/80 mt-2">
              Confidence and status summary based on the submitted sensor readings.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              isFailure ? "bg-white/20" : "bg-white/20"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isFailure ? "bg-red-200" : "bg-emerald-200"}`} />
            {result.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/15 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">Risk Probability</p>
            <p className="text-3xl font-bold mt-1">{probability}%</p>
            <p className="text-xs text-white/70 mt-1">Higher means more likely to fail</p>
          </div>
          <div className="bg-white/15 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">Risk Level</p>
            <p className="text-2xl font-bold mt-1">{riskLevel}</p>
            <p className="text-xs text-white/70 mt-1">Thresholds: 0.4 / 0.7</p>
          </div>
          <div className="bg-white/15 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">Prediction</p>
            <p className="text-2xl font-bold mt-1">{result.prediction}</p>
            <p className="text-xs text-white/70 mt-1">1 = Failure, 0 = Working</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>Risk Meter</span>
            <span>{probability}%</span>
          </div>
          <div className="bg-white/25 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${
                isFailure ? "bg-white" : "bg-emerald-200"
              }`}
              style={{ width: `${probability}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
          >
            Export Result
          </button>
          <span className="text-xs text-white/70 self-center">
            Timestamp: {new Date().toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}
