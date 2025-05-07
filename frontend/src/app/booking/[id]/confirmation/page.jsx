"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, Printer, Download, Share2 } from "lucide-react";
import { useFlights } from "@/context/flight-context";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plane } from "lucide-react";
import { formatDate } from "@/lib/utils";
import domtoimage from "dom-to-image-more";
import { jsPDF } from "jspdf";

export default function ConfirmationPage() {
  const bookingRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getBooking } = useFlights();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const bookingData = getBooking(bookingId);
    setBooking(bookingData);
    if (bookingData) {
      setLoading(false);
    }
  }, [bookingId, getBooking]);

  const handleViewAllBookings = () => {
    router.push("/bookings");
  };

  const handleDownloadPDF = async () => {
    if (!bookingRef.current) return;

    const hiddenEls = document.querySelectorAll(".no-print");
    hiddenEls.forEach((el) => (el.style.display = "none"));

    try {
      const dataUrl = await domtoimage.toPng(bookingRef.current);
      const pdf = new jsPDF("p", "mm", "a4");

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`e-ticket-${booking._id.slice(-6).toUpperCase()}-${new Date().getTime()}.pdf`);
      };
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      hiddenEls.forEach((el) => (el).style.display = "");
    }
  };

  if (loading) {
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Booking Not Found</CardTitle>
              <CardDescription>
                We couldn't find the booking you're looking for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The booking may have been cancelled or the booking ID is
                incorrect.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/")} className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 border border-green-100 rounded-lg p-6 mb-6 flex items-center"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3,
            }}
          >
            <CheckCircle2 className="h-8 w-8 text-green-500 mr-4" />
          </motion.div>
          <div>
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-semibold text-green-800"
            >
              Booking Confirmed!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-green-700"
            >
              Your booking has been confirmed and your tickets are ready.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          ref={bookingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">
                    E-Ticket
                  </CardTitle>
                  <CardDescription className="text-base">
                    Booking ID: {booking._id.slice(-6).toUpperCase()}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group no-print"
                    onClick={handleDownloadPDF}
                  >
                    <Printer className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group no-print"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group no-print"
                  >
                    <Share2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {booking.flight.flightName}
                  </h3>
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <p className="font-semibold text-xl">
                        {booking.flight.departureTime}
                      </p>
                      <p className="text-sm text-gray-500">{booking.from}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(booking.journeyDate)}
                      </p>
                    </div>
                    <div className="text-center px-4 mb-4 md:mb-0">
                      <p className="text-xs text-gray-500">
                        {booking.flight.duration}
                      </p>
                      <div className="relative h-0.5 bg-gray-200 w-32 md:w-40 my-2">
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2"
                          initial={{ left: "0%" }}
                          animate={{ left: "100%" }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            ease: "easeInOut",
                          }}
                        >
                          <Plane className="h-4 w-4 text-blue-600 -translate-y-1/2" />
                        </motion.div>
                        <div className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5 -left-1"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-blue-600 -top-0.5 -right-1"></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Flight {booking.flight.flightNo}
                      </p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="font-semibold text-xl">
                        {booking.flight.arrivalTime}
                      </p>
                      <p className="text-sm text-gray-500">{booking.to}</p>
                    </div>
                  </div>
                </motion.div>

                <Separator />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="font-semibold mb-3">Passenger Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {booking.passengers.map((passenger, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.6 + index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          whileHover={{ scale: 1.02 }}
                          className="border border-gray-200 rounded-md p-3 bg-white shadow-sm"
                        >
                          <p className="font-medium">{passenger.name}</p>
                          <p className="text-sm text-gray-500">
                            {passenger.gender}, {passenger.age} years
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-xs text-gray-400">Seat:</p>
                            <motion.span
                              className="ml-1 text-xs font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                              whileHover={{ scale: 1.1 }}
                            >
                              {20 + index}A
                            </motion.span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="font-semibold mb-2">Price Details</h3>
                    <div className="space-y-1 bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Base Fare × {booking.passengers.length}
                        </span>
                        <span>
                          ₹
                          {(
                            booking.flight.price * booking.passengers.length
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Taxes & Fees</span>
                        <span>Included</span>
                      </div>
                      <Separator className="my-2" />
                      <motion.div
                        initial={{ backgroundColor: "rgba(219, 234, 254, 0)" }}
                        animate={{
                          backgroundColor: "rgba(219, 234, 254, 0.5)",
                        }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex justify-between font-semibold p-1 rounded"
                      >
                        <span>Total Paid</span>
                        <span>
                          ₹
                          {(
                            booking.flight.price * booking.passengers.length
                          ).toLocaleString()}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="font-semibold mb-2">
                      Important Information
                    </h3>
                    <ul className="text-sm space-y-2 text-gray-600 bg-gray-50 p-3 rounded-md">
                      <motion.li
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex items-start"
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        Please arrive at the airport 2 hours before departure
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex items-start"
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        Carry a valid photo ID for verification
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex items-start"
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        Check-in counters close 45 minutes before departure
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex items-start"
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        Baggage allowance: 15kg check-in, 7kg cabin
                      </motion.li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <p className="text-sm text-gray-500">
                Booking Date: {new Date(booking.date).toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Button onClick={handleViewAllBookings} className="group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            View All Bookings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
