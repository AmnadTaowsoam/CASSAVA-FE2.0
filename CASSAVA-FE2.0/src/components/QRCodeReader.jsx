import React, { useState } from 'react';

const QRCodeReader = ({ setPredictionData = () => {} }) => {  // Default function if not provided
    const [inputText, setInputText] = useState('');
    const [formData, setFormData] = useState({
        queue: '',
        date_receive: '',
        inslot: '',
        batch: '',
        plant: '',
        material: '',
        vendor: '',
        operationno: ''
    });

    const handleAddClick = (e) => {
        e.preventDefault();
        const parts = inputText.split(',').map(part => part.trim());
        if (parts.length >= 8) {
            const data = {
                queue: parts[0] || '',
                date_receive: parts[1] || '',
                inslot: parts[2] || '',
                batch: parts[3] || '',
                plant: parts[4] || '',
                material: parts[5] || '',
                vendor: parts[6] || '',
                operationno: parts[7] || '',
            };
            setFormData(data);
            setInputText('');
            // Update interfaceData state
            setPredictionData(data);  // Use data directly or map it as needed
            console.log('Input data from QRCode successfully....');
        } else {
            console.log('Invalid input. Please provide all 8 parts.');
            clearFormData();
        }
    };

    const clearFormData = () => {
        setFormData({
            queue: '',
            date_receive: '',
            inslot: '',
            batch: '',
            plant: '',
            material: '',
            vendor: '',
            operationno: '',
        });
    };

    const handleFormDataChange = (key, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]: value,
        }));
    };

    return (
        <>
            <div className="container mx-auto font-custom p-4">
                <form>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex">
                            <input
                                type="text"
                                className="input input-bordered input-primary flex-1"
                                placeholder=">>>Scan QRCode"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button
                                className="btn btn-outline btn-primary rounded-lg ml-2 text-sm"
                                onClick={handleAddClick}
                            >
                                Split Text
                            </button>
                        </div>
                    </div>
                    {/* Grid layout for form fields */}
                    <div className="grid grid-cols-4 gap-4">
                        {Object.keys(formData).map((key) => (
                            <div key={key} className="mt-2">
                                <label
                                    htmlFor={key}
                                    className="block text-base font-medium text-gray-900 dark:text-black"
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                                    :
                                  </label>
                                <input
                                    type="text"
                                    className="input input-bordered input-primary w-full"
                                    value={formData[key]}
                                    onChange={(e) => handleFormDataChange(key, e.target.value)}
                                    placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}...`}
                                />
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </>
    );
};

export default QRCodeReader;