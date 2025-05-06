import { v4 as uuidv4 } from "uuid"

const airlines = ["IndiGo", "Air India", "SpiceJet", "Vistara", "GoAir", "AirAsia India"]

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Goa", "Jaipur"]

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0")
  const minutes = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)]
  return `${hours}:${minutes}`
}

const getRandomDuration = () => {
  const hours = 1 + Math.floor(Math.random() * 4)
  const minutes = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)]
  return `${hours}h ${minutes}m`
}

const calculateArrivalTime = (departureTime, duration) => {
  const [depHours, depMinutes] = departureTime.split(":").map(Number)
  const durationHours = Number.parseInt(duration.split("h")[0])
  const durationMinutes = Number.parseInt(duration.split(" ")[1].replace("m", ""))

  let arrHours = depHours + durationHours
  let arrMinutes = depMinutes + durationMinutes

  if (arrMinutes >= 60) {
    arrHours += 1
    arrMinutes -= 60
  }

  arrHours = arrHours % 24

  return `${arrHours.toString().padStart(2, "0")}:${arrMinutes.toString().padStart(2, "0")}`
}

const getRandomPrice = () => {
  // Random price between 2000 and 3000
  return Math.floor(2000 + Math.random() * 1000)
}

const getRandomFlightNumber = (airline) => {
  const prefix = airline.substring(0, 2).toUpperCase()
  const number = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${number}`
}

export const generateFlights = () => {
  const flights = []

  // Generate 50 flights
  for (let i = 0; i < 50; i++) {
    // Ensure from and to are different
    const fromIndex = Math.floor(Math.random() * cities.length)
    let toIndex = Math.floor(Math.random() * cities.length)
    while (fromIndex === toIndex) {
      toIndex = Math.floor(Math.random() * cities.length)
    }

    const from = cities[fromIndex]
    const to = cities[toIndex]
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const departureTime = getRandomTime()
    const duration = getRandomDuration()
    const arrivalTime = calculateArrivalTime(departureTime, duration)
    const price = getRandomPrice()
    const flightNumber = getRandomFlightNumber(airline)
    const hasMeals = Math.random() > 0.5

    flights.push({
      id: uuidv4(),
      from,
      to,
      airline,
      departureTime,
      arrivalTime,
      duration,
      price,
      flightNumber,
      hasMeals,
      priceMultiplier: 1,
    })
  }

  return flights
}
