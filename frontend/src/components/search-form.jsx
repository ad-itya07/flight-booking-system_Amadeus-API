"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CalendarIcon, Loader2, MapPin, Search } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { searchLocations } from "@/utils/amadeusAPI";
import { useFlights } from "@/context/flight-context";

export function SearchForm({
  compact = false,
  fromAirport = "",
  toAirport = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { resetFlightViews } = useFlights();

  const [fromQuery, setFromQuery] = useState(fromAirport);
  const [toQuery, setToQuery] = useState(toAirport);
  const [fromAirports, setFromAirports] = useState([]);
  const [toAirports, setToAirports] = useState([]);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [date, setDate] = useState(
    searchParams.get("date") ? new Date(searchParams.get("date")) : new Date()
  );
  const [passengers, setPassengers] = useState(
    searchParams.get("passengers") || "1"
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleFromAirportSearch = async () => {
    if (fromQuery.length < 2) {
      setFromAirports([]);
      return;
    }

    setFromLoading(true);
    try {
      const airports = await searchLocations({
        keyword: fromQuery,
      });
      setFromAirports(airports.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setFromLoading(false);
    }
  };

  useEffect(() => {
    if (fromQuery.length < 2) {
      setFromAirports([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleFromAirportSearch();
    }, 400); // Adjust delay here (ms)

    return () => clearTimeout(delayDebounce);
  }, [fromQuery]);

  useEffect(() => {
    if (toQuery.length < 2) {
      setToAirports([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleToAirportSearch();
    }, 400); // Adjust delay here (ms)

    return () => clearTimeout(delayDebounce);
  }, [toQuery]);

  const handleToAirportSearch = async () => {
    if (toQuery.length < 2) {
      setToAirports([]);
      return;
    }

    setToLoading(true);
    try {
      const airports = await searchLocations({
        keyword: toQuery,
      });
      setToAirports(airports.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setToLoading(false);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();

    if (!from || !to || !date) return;

    resetFlightViews(); // Reset flight views on search
    
    const formattedDate = formatDate(date);

    router.push(
      `/search?from=${from}&to=${to}&date=${formattedDate}&passengers=${passengers}`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "grid gap-4",
        compact
          ? "grid-cols-1 md:grid-cols-5"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
      )}
    >
      <div
        className={cn(
          "space-y-2",
          compact ? "md:col-span-2" : "md:col-span-2 lg:col-span-1"
        )}
      >
        <Label htmlFor="from">From</Label>
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="from"
                placeholder="City or Airport"
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <div className="flex items-center justify-between p-2 gap-2">
                <Input
                  placeholder="Search city or airport..."
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                />
                <Button onClick={handleFromAirportSearch}>
                  <Search />
                </Button>
              </div>
              <CommandList>
                {fromLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Searching airports...</span>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandGroup>
                      {fromAirports.map((airport) => (
                        <CommandItem
                          key={airport.id}
                          onSelect={() => {
                            setFrom(airport.address.cityName);
                            setFromQuery(airport.name);
                            setFromOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{airport.name} AIRPORT</span>
                            <span className="text-xs text-gray-500">
                              {airport.address.cityName},{" "}
                              {airport.address.stateCode}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={cn(
          "space-y-2",
          compact ? "md:col-span-2" : "md:col-span-2 lg:col-span-1"
        )}
      >
        <Label htmlFor="to">To</Label>
        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="from"
                placeholder="City or Airport"
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <div className="flex items-center justify-between p-2 gap-2">
                <Input
                  placeholder="Search city or airport..."
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                />
                <Button onClick={handleToAirportSearch}>
                  <Search />
                </Button>
              </div>
              <CommandList>
                {toLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Searching airports...</span>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandGroup>
                      {toAirports.map((airport) => (
                        <CommandItem
                          key={airport.id}
                          onSelect={() => {
                            setTo(airport.address.cityName);
                            setToQuery(airport.name);
                            setToOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{airport.name} AIRPORT</span>
                            <span className="text-xs text-gray-500">
                              {airport.address.cityName},{" "}
                              {airport.address.stateCode}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Departure Date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setCalendarOpen(false);
              }}
              initialFocus
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passengers">Passengers</Label>
        <select
          id="passengers"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Passenger" : "Passengers"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Search Flights
        </Button>
      </div>
    </form>
  );
}
