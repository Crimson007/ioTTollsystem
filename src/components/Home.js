// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Welcome to the IoT Toll System</h1>

      <div className="bg-light p-4 rounded shadow-sm">
        <p className="lead">
          Welcome to our IoT-Based Toll System project! This innovative solution is designed to streamline toll collection, 
          addressing the pressing issue of congestion and delays on busy toll roads.
          By implementing advanced image processing and predictive analytics, our system 
          ensures vehicles are identified via License Plate Recognition (LPR) and matched
          with a database of registered users, allowing for smooth passage without stopping. 
          Unregistered vehicles are directed to manual gates to maintain flow and handle 
          traffic efficiently. This system’s unique approach optimizes toll operations
          and reduces road congestion, enhancing the commuting experience on routes like 
          the Nairobi expressway.
        </p>

        <h2 className="mt-4">Registration</h2>
        <p>
          Registration involves inputting vehicle details such as the registration number, 
          color of the car, the car brand, name of the owner, contact details, and the 
          date of registration.
        </p>
        <Link to="/register" className="btn btn-primary">
          Register Vehicle
        </Link>

        <h2 className="mt-4">Verification</h2>
        <p>
          To verify the user, you enter the vehicle registration number and the phone number to identify them. 
          This process will also charge the user a toll of Ksh 100.
        </p>
        <Link to="/verify" className="btn btn-primary">
          Verify Vehicle
        </Link>
      </div>
    </div>
  );
};

export default Home;
