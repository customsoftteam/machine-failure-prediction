export default function Navigation({ active, onChange }) {
  const tabs = [
    { id: "single", label: "Single Machine" },
    { id: "bulk", label: "Bulk Prediction" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
              active === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
