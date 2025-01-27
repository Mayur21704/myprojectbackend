// // app.js

import express from "express";
import dotenv from "dotenv";
import Amadeus from "amadeus";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

// Use authentication routes
app.use("/api/v1/", authRoutes);

app.get("/api/v1/searchCity", async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Missing required keyword" });
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: "AIRPORT",
    });

    const filteredResults = response.result.data.map((item) => ({
      name: item.name,
      iataCode: item.iataCode,
      cityName: item.address.cityName,
      countryName: item.address.countryName,
    }));
    

    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/flightOffers", async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    currencyCode = "INR",
    nonStop = true,
    travelClass,
    maxPrice,
    children,
  } = req.query;

  if (
    !originLocationCode ||
    !destinationLocationCode ||
    !departureDate ||
    !adults
  ) {
    return res.status(400).json({
      error: "Missing required query parameters",
    });
  }

  const searchParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    currencyCode,
    nonStop,
    travelClass,
    max: 25,
    children,
  };

  if (returnDate) searchParams.returnDate = returnDate;
  if (maxPrice) searchParams.maxPrice = maxPrice;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(
      searchParams
    );
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
