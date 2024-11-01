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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = `${key} cannot be blank`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Error registering vehicle');
    }
  };

  return (
    <div className="container my-4">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: 'License Plate', name: 'licensePlate', placeholder: 'e.g., ABC123' },
          { label: 'Owner Name', name: 'ownerName', placeholder: 'Full Name' },
          { label: 'Car Type', name: 'carType', placeholder: 'e.g., Sedan' },
          { label: 'Brand', name: 'brand', placeholder: 'e.g., Toyota' },
          { label: 'Color', name: 'color', placeholder: 'e.g., Black' },
          { label: 'Contact', name: 'contact', type: 'number', placeholder: 'Phone Number' },
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
