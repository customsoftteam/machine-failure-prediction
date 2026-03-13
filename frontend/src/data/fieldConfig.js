export const fieldConfig = [
  {
    key: "Machine_ID",
    label: "Machine ID",
    placeholder: "1-100",
    min: 1,
    max: 100,
    step: 1,
    help: "Unique identifier for the machine",
  },
  {
    key: "Temperature",
    label: "Temperature (°C)",
    placeholder: "0-200",
    min: 0,
    max: 200,
    step: 0.1,
    help: "Operating temperature",
  },
  {
    key: "Pressure",
    label: "Pressure (PSI)",
    placeholder: "0-300",
    min: 0,
    max: 300,
    step: 0.1,
    help: "Current pressure reading",
  },
  {
    key: "Vibration",
    label: "Vibration Level",
    placeholder: "0-15",
    min: 0,
    max: 15,
    step: 0.1,
    help: "Vibration intensity",
  },
  {
    key: "Humidity",
    label: "Humidity (%)",
    placeholder: "0-100",
    min: 0,
    max: 100,
    step: 0.1,
    help: "Environmental humidity",
  },
  {
    key: "Power_Consumption",
    label: "Power Consumption (W)",
    placeholder: "0-600",
    min: 0,
    max: 600,
    step: 0.1,
    help: "Power usage",
  },
];

export const requiredCols = fieldConfig.map((f) => f.key);

export const sampleCsv =
  "Machine_ID,Temperature,Pressure,Vibration,Humidity,Power_Consumption\n" +
  "1,75.5,120,4.2,45,250\n" +
  "2,82.3,145.5,7.8,62,320\n" +
  "3,68,110,3.1,55,210\n";
