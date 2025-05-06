"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, Luggage, Plane, Utensils } from "lucide-react";
import { useFlights } from "@/context/flight-context";
import { formatDate } from "@/lib/utils";

export function FlightCard({ flight, from, to, journeyDate }) {
  const router = useRouter();
  const { trackFlightView } = useFlights();
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleBookNow = () => {
    trackFlightView(flight._id);

    const formattedDate = formatDate(journeyDate);
    router.push(`/booking/${flight._id}?from=${from}&to=${to}&date=${formattedDate}`);
  };

  return (
    <Card>
      <CardContent className="px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Flight Overview */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600 rotate-45" />
                {flight.flightName}
              </h3>
              <span className="text-xs bg-gray-200 text-gray-700 rounded px-2 py-0.5">
                {flight.flightNo}
              </span>
            </div>

            {/* Time Info with Icons */}
            <div className="flex items-center justify-between">
              {/* Departure */}
              <div className="text-center flex-1">
                <p className="font-medium text-lg">{flight.departureTime}</p>
                <p className="text-sm text-gray-500">{from}</p>
              </div>

              {/* Airplane & Duration */}
              <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-0.5 bg-gray-300 relative">
                    <Plane className="absolute -top-2 left-1/2 transform -translate-x-1/2 rotate-90 text-blue-500 w-4 h-4" />
                  </div>
                </div>
                <p className="mt-1">{flight.duration}</p>
              </div>

              {/* Arrival */}
              <div className="text-center flex-1">
                <p className="font-medium text-lg">{flight.arrivalTime}</p>
                <p className="text-sm text-gray-500">{to}</p>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col items-end justify-between gap-4 md:items-end md:justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="font-bold text-2xl text-blue-600">
                ₹{(flight.price * flight.priceMultiplier).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per passenger</p>
            </div>

            <Button onClick={handleBookNow} className="w-full md:w-auto">
              Book Now
            </Button>
          </div>
        </div>

        {/* View Details Toggle */}
        <div className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto underline underline-offset-2"
          >
            {showDetails ? "Hide details" : "View details"}
          </Button>

          {/* Details Section */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                {/* Flight Details */}
                <div>
                  <h4 className="font-semibold mb-2">Flight Details</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Duration: {flight.duration}
                    </li>
                    <li className="flex items-center">
                      <Luggage className="h-4 w-4 mr-2 text-blue-500" />
                      Baggage: 15kg check-in, 7kg cabin
                    </li>
                    <li className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-blue-500" />
                      Meals:{" "}
                      {flight.hasMeals
                        ? "Complimentary"
                        : "Available for purchase"}
                    </li>
                  </ul>
                </div>

                {/* Fare Details */}
                <div>
                  <h4 className="font-semibold mb-2">Fare Details</h4>
                  <ul className="space-y-1">
                    <li>Base fare: ₹{(flight.price * 0.8).toFixed(0)}</li>
                    <li>Taxes & fees: ₹{(flight.price * 0.2).toFixed(0)}</li>
                    <li className="font-medium">
                      Total: ₹{flight.price.toLocaleString()}
                    </li>
                  </ul>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Wi-Fi</Badge>
                    <Badge variant="outline">Power Outlets</Badge>
                    <Badge variant="outline">Entertainment</Badge>
                    {flight.hasMeals && <Badge variant="outline">Meals</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cancellation Policy */}
              <div>
                <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                <p className="text-sm text-gray-600">
                  Cancellation fee of ₹{(flight.price * 0.3).toFixed(0)} applies
                  if cancelled more than 24 hours before departure.
                  Non-refundable within 24 hours of departure.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
