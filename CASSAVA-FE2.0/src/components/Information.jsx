import React, { useState } from "react";
import predictionAPIService from "../services/PredictionAPI";
import { RegionDict } from "../assets/MasterData";

function Information({ formData, setFormData }) {
  const [fines, setFines] = useState("");
  const [bulk, setBulk] = useState("");
  const [predictionResult, setPredictionResult] = useState({
    sandPredictValue: "",
    totalSandValue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Handle changes to the fines and bulk inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fines") {
      if (!isNaN(parseFloat(value))) {
        setFines(parseFloat(value));
      } else {
        setFines(""); // หรือคุณอาจจะตั้งค่าเป็น null หรือ 0 ขึ้นอยู่กับความเหมาะสมของแอปพลิเคชันของคุณ
      }
    } else if (name === "bulk") {
      if (!isNaN(parseFloat(value))) {
        setBulk(parseFloat(value));
      } else {
        setBulk(""); // หรือคุณอาจจะตั้งค่าเป็น null หรือ 0 ขึ้นอยู่กับความเหมาะสมของแอปพลิเคชันของคุณ
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setStatusMessage("Calculating...");

    try {
      await predictionAPIService.login(); // Assuming login is handled here

      const { inslot, batch, plant, vendor, date_receive } = formData;
      const dateParts = date_receive.split(".");
      if (dateParts.length !== 3) {
        throw new Error("Invalid date format. Please use YYYY.MM.DD format.");
      }
      const month = parseInt(dateParts[1], 10);
      const region = RegionDict[vendor];
      if (!region) {
        throw new Error(`No region found for vendor code: ${vendor}`);
      }

      const finesValue = parseFloat(fines);
      const bulkValue = parseFloat(bulk);

      if (isNaN(finesValue) || isNaN(bulkValue)) {
        throw new Error("Please enter valid fines and bulk values.");
      }

      const payload = {
        inslot: formData.inslot,
        batch: formData.batch,
        month: parseInt(dateParts[1], 10),
        plant: formData.plant,
        vendor: formData.vendor,
        region: RegionDict[formData.vendor],
        fines: finesValue,
        bulk: bulkValue,
      };

      console.log("Sending data:", payload);
      const result = await predictionAPIService.sandPrediction(payload);

      setPredictionResult({
        sandPredictValue: parseFloat(result.sand_predict_value).toFixed(2),
        totalSandValue: parseFloat(result.total_sand_value).toFixed(2),
      });
      setStatusMessage("Calculation complete. Results updated below.");
    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message || "Failed to calculate. Please try again.");
      setStatusMessage(
        "Calculation failed. Please check the input and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-8 gap-4 mb-2 m-4 font-bold"
        >
          <div className="col-span-2">
            <label
              htmlFor="fines"
              className="block text-base font-medium text-gray-900 dark:text-black"
            >
              Fines:
            </label>
            <input
              type="text"
              id="fines"
              name="fines"
              value={fines}
              onChange={handleInputChange}
              className="input input-bordered input-warning w-full"
              required
              placeholder="Enter Fines..."
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="bulk"
              className="block text-base font-medium text-gray-900 dark:text-black"
            >
              Bulk:
            </label>
            <input
              type="text"
              id="bulk"
              name="bulk"
              value={bulk}
              onChange={handleInputChange}
              className="input input-bordered input-warning w-full"
              required
              placeholder="Enter Bulk..."
            />
          </div>
          <div className="col-span-2">
            <label className="block text-base font-medium text-gray-900 dark:text-black text-center">
              Sand Predict Value:
            </label>
            <div className="text-lg text-center mt-2">
              {predictionResult.sandPredictValue}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-base font-medium text-gray-900 dark:text-black text-center">
              Total Sand Value:
            </label>
            <div
              className={`text-lg text-center mt-2 ${
                predictionResult.totalSandValue > 3 ? "text-red-500" : ""
              }`}
            >
              {predictionResult.totalSandValue}
            </div>
          </div>
          <div className="col-span-8 flex justify-end mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Information;
