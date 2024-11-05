import React, { useState, useEffect } from 'react';

const Verify = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [pollCount, setPollCount] = useState(0); // Add counter for polling attempts

  useEffect(() => {
    let pollInterval;

    const checkStatus = async () => {
      if (!transactionId) return;

      try {
        const response = await fetch(`http://localhost:5000/transaction-status/${transactionId}`);
        const data = await response.json();
        
        console.log('Transaction status check:', data); // Debug log

        if (data.status === 'success') {
          setTransactionStatus('success');
          setMessage(`✅ Payment successful! Receipt: ${data.mpesaReceiptNumber}`);
          clearInterval(pollInterval);
        } else if (data.status === 'failed') {
          setTransactionStatus('failed');
          setMessage("❌ Payment failed or was cancelled. Please try again.");
          clearInterval(pollInterval);
        } else if (data.status === 'pending') {
          setPollCount(prev => {
            // Stop polling after 60 seconds (12 attempts at 5-second intervals)
            if (prev >= 12) {
              clearInterval(pollInterval);
              setTransactionStatus('timeout');
              setMessage("Transaction timed out. Please try again or check your M-Pesa messages.");
              return prev;
            }
            return prev + 1;
          });
        }
      } catch (error) {
        console.error("Error checking status:", error);
        clearInterval(pollInterval);
        setTransactionStatus('error');
        setMessage("Error checking payment status. Please check your M-Pesa messages.");
      }
    };

    if (transactionId && transactionStatus === 'pending') {
      // Reset poll count when starting new transaction
      setPollCount(0);
      
      // Check immediately
      checkStatus();
      
      // Then start polling
      pollInterval = setInterval(checkStatus, 5000);
    }

    // Cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [transactionId, transactionStatus]);

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
    setTransactionStatus('pending');
    setTransactionId(null);

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate, phoneNumber }),
      });
      const data = await response.json();
      
      if (response.ok && data.registered) {
        setVehicle(data.vehicle);
        setTransactionId(data.transactionId);
        setMessage("Please check your phone to complete the M-Pesa payment.");
      } else {
        setTransactionStatus(null);
        setMessage(data.message || "Vehicle not found. Please register.");
      }
    } catch (error) {
      console.error("Verify error:", error);
      setTransactionStatus('error');
      setMessage("Error verifying vehicle. Please try again.");
    }

    setLoading(false);
  };

  const getStatusClass = () => {
    switch (transactionStatus) {
      case 'success':
        return 'alert-success';
      case 'failed':
        return 'alert-danger';
      case 'pending':
        return 'alert-warning';
      case 'timeout':
      case 'error':
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  };

  const canStartNewTransaction = !loading && 
    transactionStatus !== 'pending' && 
    (!transactionId || ['success', 'failed', 'timeout', 'error'].includes(transactionStatus));

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
            disabled={!canStartNewTransaction}
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
            disabled={!canStartNewTransaction}
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={!canStartNewTransaction}
          className="btn btn-primary w-100"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>

      {message && (
        <div className={`alert ${getStatusClass()} mt-3`}>
          {message}
          {transactionStatus === 'pending' && (
            <div className="spinner-border spinner-border-sm ms-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      )}

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