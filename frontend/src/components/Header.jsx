export default function Header() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-xl mb-8">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_50%)]" />
      <div className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.2em] text-xs text-indigo-200 mb-3">Predictive Maintenance</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Machine Failure Predictor
          </h1>
          <p className="text-base md:text-lg text-indigo-100 mt-3">
            AI‑driven diagnostics to forecast failures early, reduce downtime, and protect critical assets.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live model
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-indigo-300" /> CSV batch scoring
            </span>
          </div>
        </div>

        {/* <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Model Type", value: "Random Forest" },
            { label: "Latency", value: "< 250ms" },
            { label: "Uptime", value: "99.9%" },
            { label: "Last Trained", value: "Jan 2026" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10"
            >
              <p className="text-xs uppercase tracking-wide text-indigo-200">{kpi.label}</p>
              <p className="text-lg font-bold mt-1 text-white">{kpi.value}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
