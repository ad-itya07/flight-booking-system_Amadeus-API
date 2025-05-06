"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletCard } from "@/components/wallet-card";
import { useFlights } from "@/context/flight-context";
import { formatDate } from "@/lib/utils";
import { Calendar, Users, Plane, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

export default function BookingsPage() {
  const { bookings } = useFlights();
  const [activeTab, setActiveTab] = useState("all");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.journeyDate) >= new Date()
  );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.journeyDate) < new Date()
  );

  const displayBookings =
    activeTab === "upcoming"
      ? upcomingBookings
      : activeTab === "past"
      ? pastBookings
      : bookings;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">
            Loading your booking details...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="md:col-span-3">
          <Card
            as={motion.div}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-2xl">My Bookings</CardTitle>
              <CardDescription className="text-base">
                View and manage all your flight bookings
              </CardDescription>
              <Tabs
                defaultValue="all"
                className="mt-4"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="all" className="relative">
                    All ({bookings.length})
                    {activeTab === "all" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="relative">
                    Upcoming ({upcomingBookings.length})
                    {activeTab === "upcoming" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past" className="relative">
                    Past ({pastBookings.length})
                    {activeTab === "past" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                      />
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0 space-y-2">
                          <Skeleton className="h-6 w-40" />
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-2 w-12" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-6 w-24 mb-4" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayBookings.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="wait">
                    {displayBookings.map((booking) => (
                      <motion.div
                        key={booking._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.01 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                              <h3 className="font-semibold text-lg">
                                {booking.flight.flightName}
                              </h3>
                              <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 ml-2">
                                {booking.flight.flightNumber}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium text-lg">
                                  {booking.flight.departureTime}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {booking.from}
                                </p>
                              </div>
                              <div className="text-center">
                                <div className="relative h-0.5 bg-gray-200 w-16 md:w-24 my-2">
                                  <motion.div
                                    className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5"
                                    initial={{ left: 0 }}
                                    animate={{ left: "100%" }}
                                    transition={{
                                      duration: 2,
                                      repeat: Number.POSITIVE_INFINITY,
                                      repeatType: "reverse",
                                      ease: "easeInOut",
                                    }}
                                  />
                                  <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-600 -top-0.5 -left-1"></div>
                                  <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-600 -top-0.5 -right-1"></div>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {booking.flight.duration}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-lg">
                                  {booking.flight.arrivalTime}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {booking.to}
                                </p>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.journeyDate)}
                              </p>
                              <span className="text-gray-400">•</span>
                              <Users className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {booking.passengers.length} passenger
                                {booking.passengers.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Total Paid
                              </p>
                              <p className="font-semibold text-lg">
                                ₹
                                {(
                                  booking.flight.price *
                                  booking.passengers.length
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="mt-4">
                              <Link
                                href={`/booking/${booking.flight._id}/confirmation?bookingId=${booking._id}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="group"
                                >
                                  <Plane className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                  View Ticket
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <Plane className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "upcoming"
                      ? "You don't have any upcoming flights."
                      : activeTab === "past"
                      ? "You don't have any past flight bookings."
                      : "You haven't booked any flights yet."}
                  </p>
                  <Link href="/">
                    <Button>Book a Flight</Button>
                  </Link>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <WalletCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full justify-start group"
                    >
                      <Plane className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Book a New Flight
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start group"
                  >
                    <motion.span
                      className="mr-2"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "linear",
                      }}
                    >
                      ⟳
                    </motion.span>
                    Check Flight Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Web Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
