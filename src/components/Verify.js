// src/components/Verify.js
import React, { useState } from 'react';


const Verify = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!licensePlate.trim()) newErrors.licensePlate = "License plate cannot be blank.";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number cannot be blank.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateFields()) return;

    setLoading(true);
    setMessage('');
    setVehicle(null);

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate, phoneNumber }),
      });
      const data = await response.json();
      
      if (response.ok && data.registered) {
        setVehicle(data.vehicle);
        setMessage("Vehicle verified successfully! Payment will be initiated.");
      } else {
        setMessage("Vehicle not found. Please register.");
      }
    } catch (error) {
      setMessage("Error verifying vehicle. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container my-4">
      <h2>Verify Vehicle</h2>
      <p className="text-muted">Verify your registration status for a smooth experience at toll points.</p>
      
      <div className="verify-form">
        <div className="form-group mb-3">
          <input
            type="text"
            placeholder="Enter License Plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className={`form-control ${errors.licensePlate ? 'is-invalid' : ''}`}
          />
          {errors.licensePlate && <div className="invalid-feedback">{errors.licensePlate}</div>}
        </div>
        
        <div className="form-group mb-3">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={loading} 
          className="btn btn-primary w-100"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>

      {message && <p className="alert alert-info mt-3">{message}</p>}

      {vehicle && (
        <div className="vehicle-info mt-4 p-3 border">
          <h3>Vehicle Information</h3>
          <p><strong>Owner:</strong> {vehicle.ownerName}</p>
          <p><strong>Car Type:</strong> {vehicle.carType}</p>
          <p><strong>Brand:</strong> {vehicle.brand}</p>
          <p><strong>Color:</strong> {vehicle.color}</p>
          <p><strong>Registration Date:</strong> {vehicle.registrationDate}</p>
          <p><strong>Contact:</strong> {vehicle.contact}</p>
        </div>
      )}
    </div>
  );
};

export default Verify;
