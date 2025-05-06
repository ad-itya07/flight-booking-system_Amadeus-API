import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_STRING;
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "server is up and running!" });
});

app.get("/api/flights", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("flightDB");
    const flights = db.collection("flights");

    const flightData = await flights
      .aggregate([{ $sample: { size: 10 } }])
      .toArray();

    res.status(200).json(flightData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});

app.post("/api/bookings", async (req, res) => {
  const { flight, passengers, from, to } = req.body;
  try {
    await client.connect();
    const db = client.db("flightDB");
    const bookings = db.collection("bookings");

    const bookingData = {
      flight,
      passengers,
      from,
      to,
      date: new Date(),
      journeyDate: new Date(req.body.journeyDate),
    };

    const result = await bookings.insertOne(bookingData);

    const newBooking = await bookings.findOne({ _id: result.insertedId });

    res.status(201).json({ booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});

app.get("/api/bookings", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("flightDB");
    const bookings = db.collection("bookings");

    const bookingData = await bookings.find().toArray();
    res.status(200).json(bookingData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
