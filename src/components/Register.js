// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    ownerName: '',
    carType: '',
    brand: '',
    color: '',
    contact: '',
    registrationDate: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation for empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} cannot be blank`;
      }
    });

    // Phone number validation (Kenyan format: starts with 07 and has 10 digits)
    if (formData.contact && !/^(07|01)\d{8}$/.test(formData.contact)) {
      newErrors.contact = 'Phone number must start with "07" or "01" and contain 10 digits.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      alert(response.data.message);
      setFormData({
        licensePlate: '',
        ownerName: '',
        carType: '',
        brand: '',
        color: '',
        contact: '',
        registrationDate: '',
      });
      setErrors({});
    } catch (error) {
      alert('Error registering vehicle. Please try again.');
    }
  };

  return (
    <div className="container my-4">
      <h2>Vehicle Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: 'License Plate', name: 'licensePlate', placeholder: 'e.g., ABC123' },
          { label: 'Owner Name', name: 'ownerName', placeholder: 'Full Name' },
          { label: 'Car Type', name: 'carType', placeholder: 'e.g., Sedan' },
          { label: 'Brand', name: 'brand', placeholder: 'e.g., Toyota' },
          { label: 'Color', name: 'color', placeholder: 'e.g., Black' },
          { label: 'Contact', name: 'contact', type: 'text', placeholder: 'Phone Number (e.g., 0712345678)' },
          { label: 'Registration Date', name: 'registrationDate', type: 'date' },
        ].map(({ label, name, type = 'text', placeholder }) => (
          <div className="form-group mb-3" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
            />
            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
          </div>
        ))}
        
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
