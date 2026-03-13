import axios from "axios";

const API = axios.create({
  baseURL: "https://machine-failure-prediction-7mnf.onrender.com",
  timeout: 60000,
});

export const predictSingle = (payload) =>
  API.post("/predict", payload);

export const predictBatch = (records) =>
  API.post("/predict/batch", { records });
