"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const FlightContext = createContext({
  flights: [],
  bookings: [],
  wallet: 50000,
  getFlight: () => null,
  trackFlightView: () => {},
  bookFlight: () => "",
  getBooking: () => null,
});

export const useFlights = () => useContext(FlightContext);

export const FlightProvider = ({ children }) => {
  const [allFlights, setAllFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wallet, setWallet] = useState(50000);
  const [flightViews, setFlightViews] = useState({});

  // Initialize flights
  useEffect(() => {
    async function fetchRandomFlights() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flights`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch flights");
        }

        const data = await res.json();
        setAllFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
        return null;
      }
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    };

    fetchRandomFlights();
    fetchBookings();
  }, []);

  // Reset flight prices after 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedViews = {};
      let hasChanges = false;

      Object.entries(flightViews).forEach(([id, data]) => {
        // If it's been more than 10 minutes since last view, reset
        if (now - data.lastViewed > 10 * 60 * 1000) {
          hasChanges = true;
          // Don't include this flight in the updated views (effectively removing it)
        } else {
          updatedViews[id] = data;
        }
      });

      if (hasChanges) {
        setFlightViews(updatedViews);

        // Reset prices for flights that are no longer in the views
        setAllFlights((prev) =>
          prev.map((flight) => {
            if (!updatedViews[flight._id] && flight.priceMultiplier > 1) {
              return { ...flight, priceMultiplier: 1 };
            }
            return flight;
          })
        );
      }
    }, 5 * 1000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [flightViews]);

  const getFlight = (id) => {
    return allFlights.find((flight) => flight._id === id) || null;
  };

  const trackFlightView = (id) => {
    const now = Date.now();

    setFlightViews((prev) => {
      const prevView = prev[id] || { count: 0, lastViewed: now };
      const withinFiveMin = now - prevView.lastViewed <= 5 * 60 * 1000;
  
      const updatedCount = withinFiveMin ? prevView.count + 1 : 1;
  
      return {
        ...prev,
        [id]: {
          count: updatedCount,
          lastViewed: now,
        },
      };
    });

    // If viewed 3 times, increase price by 10%
    setAllFlights((prev) =>
      prev.map((flight) => {
        if (flight._id === id) {
          const currentViews = flightViews[id]?.count || 0;
          if (currentViews + 1 >= 3 && flight.priceMultiplier === 1) {
            return { ...flight, priceMultiplier: 1.1 };
          }
        }
        return flight;
      })
    );
  };

  const bookFlight = async (flightId, passengers, from, to, journeyDate) => {
    const flight = getFlight(flightId);
    if (!flight) return "";

    const totalPrice = flight.price * passengers.length;

    // Deduct from wallet
    setWallet((prev) => prev - totalPrice);

    // Prepare booking data
    const bookingData = {
      flight,
      passengers,
      from,
      to,
      journeyDate,
    };

    try {
      // Create booking via API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const data = await response.json();
      const { booking } = data;

      setBookings((prev) => [...prev, booking]);

      return booking;
    } catch (error) {
      console.error("Error booking flight:", error);
      return "";
    }
  };

  const getBooking = (id) => {
    return bookings.find((booking) => booking._id === id) || null;
  };

  return (
    <FlightContext.Provider
      value={{
        flights: allFlights,
        bookings,
        wallet,
        getFlight,
        trackFlightView,
        bookFlight,
        getBooking,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};
