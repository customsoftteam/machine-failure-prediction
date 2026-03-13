import { useState } from "react";
import Papa from "papaparse";
import { predictSingle, predictBatch } from "./api/api";
import { fieldConfig, requiredCols, sampleCsv } from "./data/fieldConfig";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import BulkUpload from "./components/BulkUpload";
import BatchResults from "./components/BatchResults";
import Footer from "./components/Footer";

export default function App() {
  const [form, setForm] = useState(
    fieldConfig.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
  );
  const [result, setResult] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loadingSingle, setLoadingSingle] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [activeTab, setActiveTab] = useState("single");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setFormError("");
  };

  const validateForm = () => {
    const errors = {};
    fieldConfig.forEach((f) => {
      const value = form[f.key];
      if (value === "") {
        errors[f.key] = "Required";
        return;
      }
      const num = Number(value);
      if (Number.isNaN(num)) {
        errors[f.key] = "Must be a number";
        return;
      }
      if (num < f.min || num > f.max) {
        errors[f.key] = `Range ${f.min}-${f.max}`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoadingSingle(true);
      setResult(null);
      setFormError("");
      const payload = fieldConfig.reduce((acc, f) => {
        acc[f.key] = Number(form[f.key]);
        return acc;
      }, {});
      const res = await predictSingle(payload);
      setResult(res.data);
      // Scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById("result-card");
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "API connection error. Please check if the backend server is running.";
      setFormError(errorMessage);
    } finally {
      setLoadingSingle(false);
    }
  };

  const handleCSVUpload = (file) => {
    setBatchError("");
    setBatchResult(null);
    setCsvData([]);
    setCsvPreview([]);
    setCsvRowCount(0);

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (res) => {
        const rows = res.data || [];
        const columns = res.meta?.fields || [];
        const colLower = columns.map((c) => c.toLowerCase());

        const columnMap = {};
        const missing = [];
        requiredCols.forEach((col) => {
          if (columns.includes(col)) {
            columnMap[col] = col;
          } else if (colLower.includes(col.toLowerCase())) {
            const idx = colLower.indexOf(col.toLowerCase());
            columnMap[col] = columns[idx];
          } else if (col === "Vibration" && columns.includes("Vibration_Level")) {
            columnMap[col] = "Vibration_Level";
          } else {
            missing.push(col);
          }
        });

        if (missing.length) {
          setBatchError(`Missing required columns: ${missing.join(", ")}`);
          return;
        }

        const normalized = rows.map((row) =>
          requiredCols.reduce((acc, col) => {
            acc[col] = row[columnMap[col]];
            return acc;
          }, {})
        );

        setCsvData(normalized);
        setCsvPreview(normalized.slice(0, 8));
        setCsvRowCount(normalized.length);
      },
      error: () => setBatchError("Failed to parse CSV file."),
    });
  };

  const runBulkPrediction = async () => {
    if (!csvData.length) {
      setBatchError("Please upload a valid CSV with required columns.");
      return;
    }

    try {
      setLoadingBatch(true);
      setBatchResult(null);
      setBatchError("");
      const res = await predictBatch(csvData);
      setBatchResult(res.data);
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("batch-results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Bulk prediction failed. Please check if the backend server is running.";
      setBatchError(errorMessage);
    } finally {
      setLoadingBatch(false);
    }
  };

  const resetForm = () => {
    setForm(fieldConfig.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}));
    setFormErrors({});
    setFormError("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Header />

        <Navigation active={activeTab} onChange={setActiveTab} />

        {activeTab === "single" && (
          <>
            <InputForm
              fieldConfig={fieldConfig}
              form={form}
              formErrors={formErrors}
              formError={formError}
              loading={loadingSingle}
              onChange={handleChange}
              onSubmit={handlePredict}
              onClear={resetForm}
            />

            <div id="result-card">
              <ResultCard result={result} />
            </div>
          </>
        )}

        {activeTab === "bulk" && (
          <>
            <BulkUpload
              requiredCols={requiredCols}
              sampleCsv={sampleCsv}
              onFile={handleCSVUpload}
              batchError={batchError}
              csvPreview={csvPreview}
              loading={loadingBatch}
              canRun={csvData.length > 0}
              onRun={runBulkPrediction}
              totalRows={csvRowCount}
            />

            <div id="batch-results">
              <BatchResults batchResult={batchResult} />
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
