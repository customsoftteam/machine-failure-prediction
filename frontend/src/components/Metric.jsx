export default function Metric({ label, value }) {
  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
