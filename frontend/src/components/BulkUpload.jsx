import { useRef, useState } from "react";

export default function BulkUpload({
  requiredCols,
  sampleCsv,
  onFile,
  batchError,
  csvPreview,
  loading,
  canRun,
  onRun,
  totalRows,
}) {
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;
    setFileInfo({ name: file.name, size: file.size });
    onFile(file);
  };

  const handleClear = () => {
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFile(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Bulk Prediction (CSV)</h3>
          <p className="text-sm text-slate-500 mt-1">Upload a CSV to score multiple machines at once.</p>
        </div>
        <a
          className="text-indigo-600 font-semibold hover:underline"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`}
          download="sample_machine_data.csv"
        >
          Download Sample CSV
        </a>
      </div>

      <div className="mt-4">
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <p className="font-bold text-lg mb-2">
            {isDragging ? "Drop your CSV file here" : "Drag & drop your CSV here"}
          </p>
          <p className="text-sm text-slate-500 mb-4">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              Browse File
            </button>
          <p className="text-xs text-slate-500 mt-4">Accepted format: .csv</p>
        </div>

        {fileInfo && (
          <div className="mt-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">{fileInfo.name}</p>
              <p className="text-xs text-slate-600">{formatSize(fileInfo.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        <p className="text-sm text-slate-500 mt-2">
          Required columns: {requiredCols.join(", ")}
        </p>
        {totalRows > 0 && (
          <p className="text-sm text-slate-500 mt-1">Rows detected: {totalRows}</p>
        )}
      </div>

      {batchError && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-red-700 font-semibold">{batchError}</p>
        </div>
      )}

      {csvPreview.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-gray-700">Preview (first 8 rows)</h4>
          <div className="overflow-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  {requiredCols.map((c) => (
                    <th key={c} className="px-4 py-3 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvPreview.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-t transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50`}
                  >
                    {requiredCols.map((c) => (
                      <td key={c} className="px-4 py-2 text-slate-700">
                        {row[c] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={onRun}
        disabled={loading || !canRun}
        className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mx-auto shadow-sm"
      >
        {loading ? `Processing ${totalRows} records...` : `Run Bulk Prediction (${totalRows} records)`}
      </button>
    </div>
  );
}
