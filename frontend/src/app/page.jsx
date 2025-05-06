"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plane, ArrowRight, ChevronDown } from "lucide-react";
import { WalletCard } from "@/components/wallet-card";
import { SearchForm }from "@/components/search-form";
import { HowItWorks }from "@/components/how-it-works";

export default function HeroSection() {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            background: "linear-gradient(to right, #2563EB, #4F46E5)",
            backgroundSize: "200% 200%",
            zIndex: 0,
          }}
        />

        {/* Faint Overlay Image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }}
        />

        <div ref={ref} className="relative z-10 pt-16 md:pt-24 pb-36">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center text-white">
              {/* Left Content */}
              <motion.div
                className="md:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
              >
                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Find and Book Your Perfect Flight
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl mb-6 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Search for flights to any destination and book with ease.
                  Enjoy the best prices and a seamless booking experience.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="hidden md:inline-block"
                >
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 group transition"
                  >
                    <Plane className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    Explore Destinations
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Wallet Card on the Right */}
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <WalletCard />
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 1.5, duration: 1 },
                y: {
                  delay: 1.5,
                  duration: 1.5,
                  repeat: Infinity,
                },
              }}
            >
              <p className="text-sm mb-1">Scroll to search</p>
              <ChevronDown className="h-6 w-6" />
            </motion.div>

            {/* Search Form */}
            <motion.div
              className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden px-6 py-8"
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.8,
                type: "spring",
                stiffness: 100,
              }}
            >
              <SearchForm />
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <motion.div
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <HowItWorks />
      </motion.div>
    </div>
  );
}
