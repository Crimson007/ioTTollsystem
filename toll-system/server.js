// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // for API requests
const app = express();
const { Buffer } = require('buffer');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MongoDB connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectToDatabase();

// Define the Vehicle schema and model
const vehicleSchema = new mongoose.Schema({
  licensePlate: String,
  ownerName: String,
  carType: String,
  brand: String,
  color: String,
  registrationDate: String,
  contact: Number,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// M-Pesa Functions
async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });

  return response.data.access_token;
}



async function initiateMpesaPayment(phone, amount = 100) {
  try {
    const token = await getMpesaAccessToken(); // Ensure you have a function to get the access token
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    // Format phone number to international format without "+" sign
    const formattedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'TollPayment',
        TransactionDesc: 'Toll Fee Payment'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    console.error("M-Pesa payment initiation error:", error.response?.data || error.message);
    throw error;
  }
}



// Routes
app.get('/', (req, res) => res.send("API is running"));

app.post('/register', async (req, res) => {
  try {
    const { licensePlate, ownerName, carType, brand, color, contact, registrationDate } = req.body;
    const vehicle = new Vehicle({ licensePlate, ownerName, carType, brand, color, contact, registrationDate });
    await vehicle.save();
    res.status(201).send({ message: "✔️ Successful Registration" });
  } catch (error) {
    res.status(500).send({ message: "❌ Error registering vehicle!", error });
  }
});

app.post('/verify', async (req, res) => {
  try {
    const { licensePlate, phone } = req.body;
    const vehicle = await Vehicle.findOne({ licensePlate });

    if (vehicle) {
      // Vehicle found, initiate M-Pesa payment
      const paymentResponse = await initiateMpesaPayment(phone);

      if (paymentResponse.ResponseCode === "0") {
        res.status(200).send({
          registered: true,
          message: "Payment initiated successfully. Please complete the payment on your M-Pesa.",
          paymentResponse
        });
      } else {
        res.status(500).send({
          registered: true,
          message: "Payment initiation failed. Please try again.",
          paymentResponse
        });
      }
    } else {
      // Vehicle not found
      res.status(404).send({ registered: false, message: "Vehicle not found. Please register first." });
    }
  } catch (error) {
    res.status(500).send({ message: "Error verifying vehicle", error });
  }
});

// M-Pesa Callback Route
app.post('/mpesa/callback', (req, res) => {
  const { Body } = req.body;

  // Check if the transaction was successful
  if (Body.stkCallback.ResultCode === 0) {
    // Payment was successful
    console.log("Payment successful for phone:", Body.stkCallback.CallbackMetadata.Item[4].Value);
  } else {
    console.log("Payment failed with message:", Body.stkCallback.ResultDesc);
  }

  // Respond to M-Pesa
  res.status(200).send("Received");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
