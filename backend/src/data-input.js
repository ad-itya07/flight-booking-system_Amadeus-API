import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_STRING; 
const client = new MongoClient(uri);

function getRandomTime(baseHour = 0, maxHour = 24) {
  const hour = Math.floor(Math.random() * (maxHour - baseHour)) + baseHour;
  const min = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function getRandomDuration() {
  const hours = Math.floor(Math.random() * 5) + 1; // 1 to 5 hours
  const mins = Math.floor(Math.random() * 60);
  return `${hours}h ${mins}m`;
}

function getRandomPrice() {
  return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
}

function generateFlights() {
  const flights = [];
  const airlineNames = ['AirJet', 'SkyWays', 'BlueAir', 'JetStream', 'GoFly', 'ZoomAir', 'SkyNet'];
  for (let i = 1; i <= 50; i++) {
    const departure = getRandomTime(0, 20); // depart before 8pm
    const durationH = Math.floor(Math.random() * 5) + 1;
    const durationM = Math.floor(Math.random() * 60);
    const arrivalH = Math.min(23, parseInt(departure.split(':')[0]) + durationH);
    const arrivalM = (parseInt(departure.split(':')[1]) + durationM) % 60;
    const arrival = `${arrivalH.toString().padStart(2, '0')}:${arrivalM.toString().padStart(2, '0')}`;

    const airline = airlineNames[Math.floor(Math.random() * airlineNames.length)];
    flights.push({
      flightName: airline,
      flightNo: `FL-${1000 + i}`,
      departureTime: departure,
      arrivalTime: arrival,
      duration: `${durationH}h ${durationM}m`,
      price: getRandomPrice()
    });
  }
  return flights;
}

async function main() {
  try {
    await client.connect();
    const db = client.db('flightDB'); 
    const flights = db.collection('flights');
    
    const data = generateFlights();
    const result = await flights.insertMany(data);
    console.log(`Inserted ${result.insertedCount} flights.`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
