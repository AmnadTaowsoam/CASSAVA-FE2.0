import React, { useState, useEffect } from "react";
import QRCodeReader from "../components/QRCodeReader";
import Information from "../components/Information";
import InterfaceResult from "../components/InterfaceResult";

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

  const [interfaceData, setInterfaceData] = useState({
    fines: '',
    bulk: '',
    totalSandValue: ''
  });

  useEffect(() => {
  }, [predictionData]);

  return (
    <div className="flex justify-center m-4">
      <div className="md:container md:mx-auto w-1/2">
        <h1 className="text-center text-4xl font-bold m-4">Sand in Cassava Calculator</h1>
        <QRCodeReader setPredictionData={setPredictionData} />
        <Information 
          formData={predictionData} 
          setFormData={setPredictionData}
          setInterfaceResult={setInterfaceData}
          />
        <InterfaceResult 
          formData={predictionData}
          interfaceData={interfaceData}
          />
      </div>
    </div>
  );
};

export default Home;
