"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { FlightCard } from "@/components/flight-card";
import { SearchForm } from "@/components/search-form";
import { WalletCard } from "@/components/wallet-card";
import { ClockArrowUp, Loader2, Plane } from "lucide-react";
import { useFlights } from "@/context/flight-context";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { flights: allFlights } = useFlights();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const passengers = searchParams.get("passengers") || "1";

  const [priceRange, setPriceRange] = useState([2000, 3000]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [departureTime, setDepartureTime] = useState([]);
  const [sortBy, setSortBy] = useState("price-asc");

  const airlines = [...new Set(flights.map((flight) => flight.flightName))];

  useEffect(() => {
    setFlights(allFlights);
  }, [allFlights]);

  useEffect(() => {
    if (flights.length === 0) return;

    let result = [...flights];

    // Filter by price range
    result = result.filter(
      (flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );

    // Filter by selected airlines (flightName)
    if (selectedAirlines.length > 0) {
      result = result.filter((flight) =>
        selectedAirlines.includes(flight.flightName)
      );
    }

    // Filter by departure time (morning, afternoon, etc.)
    if (departureTime.length > 0) {
      result = result.filter((flight) => {
        const hour = parseInt(flight.departureTime.split(":")[0]);
        if (departureTime.includes("morning") && hour >= 5 && hour < 12)
          return true;
        if (departureTime.includes("afternoon") && hour >= 12 && hour < 17)
          return true;
        if (departureTime.includes("evening") && hour >= 17 && hour < 21)
          return true;
        if (departureTime.includes("night") && (hour >= 21 || hour < 5))
          return true;
        return false;
      });
    }

    // Sorting based on selected criteria
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "duration-asc") {
      result.sort((a, b) => {
        const durationA =
          parseInt(a.duration.split("h")[0]) * 60 +
          parseInt(a.duration.split(" ")[1].replace("m", ""));
        const durationB =
          parseInt(b.duration.split("h")[0]) * 60 +
          parseInt(b.duration.split(" ")[1].replace("m", ""));
        return durationA - durationB;
      });
    } else if (sortBy === "departure-asc") {
      result.sort((a, b) => {
        const timeA = a.departureTime.split(":").map(Number);
        const timeB = b.departureTime.split(":").map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
    } else if (sortBy === "departure-desc") {
      result.sort((a, b) => {
        const timeA = a.departureTime.split(":").map(Number);
        const timeB = b.departureTime.split(":").map(Number);
        return timeB[0] * 60 + timeB[1] - (timeA[0] * 60 + timeA[1]);
      });
    }

    setFilteredFlights(result);
    setLoading(false);
  }, [flights, priceRange, selectedAirlines, departureTime, sortBy]);

  const handleAirlineChange = (airline, checked) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    }
  };

  const handleDepartureTimeChange = (time, checked) => {
    if (checked) {
      setDepartureTime([...departureTime, time]);
    } else {
      setDepartureTime(departureTime.filter((t) => t !== time));
    }
  };

  const handleReset = () => {
    setPriceRange([2000, 3000]);
    setSelectedAirlines(airlines);
    setDepartureTime([]);
    setSortBy("price-asc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3 flex flex-col justify-center items-start"
          >
            <h2 className="text-xl font-semibold mb-4">Modify your search</h2>
            <SearchForm compact fromAirport={from} toAirport={to} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1 flex justify-center items-start"
          >
            <WalletCard />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1  lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="order-last lg:order-first lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Flights from {from} to {to}
                </h1>
                <p className="text-gray-600">
                  {date} · {passengers} passenger
                  {parseInt(passengers) > 1 ? "s" : ""}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration-asc">Duration: Shortest</option>
                  <option value="departure-asc">Departure: Earliest</option>
                  <option value="departure-desc">Departure: Latest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg">
                  Finding the best flights for you...
                </span>
              </div>
            ) : filteredFlights.length > 0 ? (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {filteredFlights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FlightCard
                      key={flight._id}
                      flight={flight}
                      from={from}
                      to={to}
                      journeyDate={date}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or select a different date.
                </p>
                <Button onClick={handleReset}>Reset Filters</Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[2000, 3000]}
                    min={2000}
                    max={3000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Airlines */}
              <div className="flex justify-between gap-2">
                <div>
                  <h3 className="font-medium mb-4 flex gap-2"><Plane />Airlines</h3>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div
                        key={airline}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`airline-${airline}`}
                          checked={selectedAirlines.includes(airline)}
                          onCheckedChange={(checked) =>
                            handleAirlineChange(airline, checked === true)
                          }
                        />
                        <Label htmlFor={`airline-${airline}`}>{airline}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div>
                  <h3 className="font-medium mb-4 flex gap-2"><ClockArrowUp />Departure Time</h3>
                  <div className="space-y-2">
                    {["morning", "afternoon", "evening", "night"].map(
                      (time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            id={`time-${time}`}
                            checked={departureTime.includes(time)}
                            onCheckedChange={(checked) =>
                              handleDepartureTimeChange(time, checked === true)
                            }
                          />
                          <Label htmlFor={`time-${time}`}>
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
