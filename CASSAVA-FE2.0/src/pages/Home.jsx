import React, { useState, useEffect } from "react";
import QRCodeReader from "../components/QRCodeReader";
import Information from "../components/Information";

const Home = () => {
  const [predictionData, setPredictionData] = useState({
    queue: '',
    inslot: '',
    date_receive: '',
    batch: '',
    plant: '',
    material: '',
    vendor: '',
    operationno: '',
  });

  useEffect(() => {
    console.log('predictionData updated:', predictionData);
  }, [predictionData]);

  return (
    <div className="flex justify-center m-4">
      <div className="md:container md:mx-auto w-1/2">
        <h1 className="text-center text-4xl font-bold m-4">Sand Calculator</h1>
        <QRCodeReader setPredictionData={setPredictionData} />
        <Information formData={predictionData} setFormData={setPredictionData} />
      </div>
    </div>
  );
};

export default Home;
