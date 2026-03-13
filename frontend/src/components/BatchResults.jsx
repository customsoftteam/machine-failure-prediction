import { useState } from "react";
import Metric from "./Metric";
import StatusBadge from "./StatusBadge";

export default function BatchResults({ batchResult }) {
  const [filterStatus, setFilterStatus] = useState("all");

  if (!batchResult) return null;

  const handleExport = () => {
    const headers = ["Row", "Machine_ID", "Status", "Failure_Probability", "Risk_Level"];
    const rows = batchResult.results
      .filter((r) => !r.error)
      .map((r) => {
        const prob = r.failure_probability !== undefined ? (r.failure_probability * 100).toFixed(1) : "";
        const riskLevel = r.failure_probability >= 0.7 ? "High" : r.failure_probability >= 0.4 ? "Medium" : "Low";
        return [r.row, r.Machine_ID ?? "", r.status ?? "", prob, riskLevel];
      });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-predictions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = Array.isArray(batchResult.results)
    ? batchResult.results.filter((r) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "failure") return r.status === "FAILURE";
        if (filterStatus === "working") return r.status === "WORKING";
        if (filterStatus === "error") return !!r.error;
        return true;
      })
    : [];

  const successRate = batchResult.total_records > 0
    ? ((batchResult.successful_predictions / batchResult.total_records) * 100).toFixed(1)
    : 0;

  return (
    <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Batch Summary</h3>
          <p className="text-sm text-slate-500 mt-1">Overview of batch health and prediction outcomes.</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Metric label="Total Records" value={batchResult.total_records} />
        <Metric label="Successful" value={batchResult.successful_predictions} />
        <Metric label="Failures Detected" value={batchResult.failures_detected} />
        <Metric label="Working" value={batchResult.working_machines} />
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <p className="text-sm text-slate-600">Success Rate</p>
          <p className="text-2xl font-bold text-indigo-700">{successRate}%</p>
        </div>
      </div>

      {Array.isArray(batchResult.results) && batchResult.results.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              "all",
              "failure",
              "working",
              "error",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 capitalize ${
                  filterStatus === filter
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter === "all" ? "All Results" : filter === "error" ? "Errors" : filter}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-auto border border-slate-200 rounded-2xl max-h-[26rem]">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Row</th>
                  <th className="px-4 py-3 text-left font-semibold">Machine_ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Risk Probability</th>
                  <th className="px-4 py-3 text-left font-semibold">Risk Level</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No results found for the selected filter
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((r, idx) => {
                    const prob = r.failure_probability !== undefined ? r.failure_probability : 0;
                    const riskLevel = prob >= 0.7 ? "High" : prob >= 0.4 ? "Medium" : "Low";
                    return (
                      <tr
                        key={r.row}
                        className={`transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-4 py-3 font-medium">{r.row}</td>
                        <td className="px-4 py-3">{r.Machine_ID ?? "-"}</td>
                        <td className="px-4 py-3">
                          {r.failure_probability !== undefined ? (
                            <span className="font-semibold">
                              {(r.failure_probability * 100).toFixed(1)}%
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.failure_probability !== undefined ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                riskLevel === "High"
                                  ? "bg-red-100 text-red-700"
                                  : riskLevel === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {riskLevel}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.error ? (
                            <span className="text-red-600 text-xs font-semibold">{r.error}</span>
                          ) : r.status ? (
                            <StatusBadge status={r.status} />
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing {filteredResults.length} of {batchResult.results.length} results
          </p>
        </>
      )}
    </div>
  );
}
