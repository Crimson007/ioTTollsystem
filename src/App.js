import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Verify from './components/Verify';
import Contact from './components/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation bar container */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img src="/21.png" alt="logo" width="45" height="40" className="me-2" />
              <span className="logo-text">IoT Toll System</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register Vehicle</Link>
                </li>
                <li className="nav-item">
                  <Link to="/verify" className="nav-link">Verify Vehicle</Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="py-3 my-4 bg-light">
        <div className="container">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item"><Link to="/" className="nav-link px-2 text-body-secondary">Home</Link></li>
            <li className="nav-item"><Link to="/register" className="nav-link px-2 text-body-secondary">Vehicle Registration</Link></li>
            <li className="nav-item"><Link to="/verify" className="nav-link px-2 text-body-secondary">Toll Payment</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link px-2 text-body-secondary">Contacts</Link></li>
          </ul>
          <p className="text-center text-body-secondary">© IoT Toll System, Final Year Project.<br />Gideon Maina<br />Tonyblaire Odhiambo<br />Millicent Mbuka</p>
        </div>
      </footer>
    </Router>
  );
};

export default App;
