"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle } from "lucide-react";
import { useFlights } from "@/context/flight-context";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Wallet,
  ArrowRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const journeyDate = searchParams.get("date");
  const { flights, getFlight, bookFlight, wallet } = useFlights();
  const [flight, setFlight] = useState();
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "Male" },
  ]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    params.id;
    const flightData = flights.find((flight) => flight._id === params.id);
    setFlight(flightData);
    setLoading(false);
  }, []);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "Male" }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    }
  };

  const handleBooking = async () => {
    if (!flight) return;

    // Validate passenger details
    const isValid = passengers.every(
      (p) => p.name.trim() !== "" && p.age.trim() !== ""
    );
    if (!isValid) {
      toast.error("Invalid passenger details");
      return;
    }

    // Check wallet balance
    const totalPrice = flight.price * passengers.length;
    if (wallet < totalPrice) {
      toast.error("Insufficient balance");
      return;
    }

    setIsBooking(true);

    const booking = await bookFlight(flight._id, passengers, from, to, journeyDate );
    setIsBooking(false);

    toast.success("Booking successful!");

    router.push(`/booking/${flight._id}/confirmation?bookingId=${booking._id}`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" },
          }}
        >
          <Loader2 className="h-10 w-10 text-blue-600" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="ml-4 text-lg font-medium"
        >
          Loading flight details...
        </motion.span>
      </motion.div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              delay: 0.2,
            }}
          >
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          </motion.div>
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold text-red-800"
            >
              Flight not found
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-red-700 mt-1"
            >
              The flight you're looking for doesn't exist or has been removed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="mt-4 group"
                onClick={() => router.push("/")}
              >
                <ArrowRight className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                Return to home
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Passenger Details
              </CardTitle>
              <CardDescription className="text-base">
                Please enter the details of all passengers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence>
                {passengers.map((passenger, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.h3
                        className="font-medium flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm mr-2">
                          {index + 1}
                        </span>
                        Passenger {index + 1}
                      </motion.h3>
                      {passengers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePassenger(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 group"
                        >
                          <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Label
                          htmlFor={`name-${index}`}
                          className="text-sm font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id={`name-${index}`}
                          value={passenger.name}
                          onChange={(e) =>
                            handlePassengerChange(index, "name", e.target.value)
                          }
                          placeholder="Enter full name as per ID"
                          className="border-blue-100 focus:border-blue-300"
                        />
                      </motion.div>
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Label
                          htmlFor={`age-${index}`}
                          className="text-sm font-medium"
                        >
                          Age
                        </Label>
                        <Input
                          id={`age-${index}`}
                          value={passenger.age}
                          onChange={(e) =>
                            handlePassengerChange(index, "age", e.target.value)
                          }
                          placeholder="Enter age"
                          type="number"
                          className="border-blue-100 focus:border-blue-300"
                        />
                      </motion.div>
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Label
                          htmlFor={`gender-${index}`}
                          className="text-sm font-medium"
                        >
                          Gender
                        </Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) =>
                            handlePassengerChange(index, "gender", value)
                          }
                        >
                          <SelectTrigger
                            id={`gender-${index}`}
                            className="border-blue-100 focus:border-blue-300"
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                    {index < passengers.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={addPassenger}
                  className="mt-2 border-dashed border-blue-200 hover:border-blue-400 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Add Another Passenger
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-800">Wallet Balance</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              ₹{wallet.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {wallet >= flight.price * passengers.length
                ? "Sufficient balance for this booking"
                : "Add more funds to complete this booking"}
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="font-semibold text-lg">{flight.flightName}</h3>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">{flight.flightNo}</p>
                    <p className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 ml-2 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {flight.date}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-xl">
                      {flight.departureTime}
                    </p>
                    <p className="text-sm text-gray-500">{from}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {flight.duration}
                    </p>
                    <div className="relative h-0.5 bg-gray-200 w-16 my-2">
                      <motion.div
                        className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5"
                        initial={{ left: 0 }}
                        animate={{ left: "100%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                      />
                      <div className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5 -left-1"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5 -right-1"></div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">Direct</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xl">
                      {flight.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-500">{to}</p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex justify-between mb-2">
                    <span>Base fare × {passengers.length}</span>
                    <span>
                      ₹{(flight.price * flight.priceMultiplier * passengers.length).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-500">
                    <span>Taxes & fees</span>
                    <span>Included</span>
                  </div>
                  <Separator className="my-2" />
                  <motion.div
                    animate={{
                      backgroundColor: [
                        "rgba(219, 234, 254, 0)",
                        "rgba(219, 234, 254, 0.3)",
                        "rgba(219, 234, 254, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="flex justify-between font-semibold text-lg p-2 rounded-md"
                  >
                    <span>Total</span>
                    <span>
                      ₹{(flight.price * flight.priceMultiplier * passengers.length).toLocaleString()}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 border-t">
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleBooking}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ₹{(flight.price * flight.priceMultiplier * passengers.length).toLocaleString()}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
