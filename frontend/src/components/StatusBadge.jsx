export default function StatusBadge({ status }) {
  const isFailure = status === "FAILURE";
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${
        isFailure ? "bg-red-600 shadow-sm" : "bg-emerald-600 shadow-sm"
      }`}
    >
      {status}
    </span>
  );
}
