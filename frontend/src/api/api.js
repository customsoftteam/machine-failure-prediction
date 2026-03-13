import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 60000,
});

export const predictSingle = (payload) =>
  API.post("/predict", payload);

export const predictBatch = (records) =>
  API.post("/predict/batch", { records });
