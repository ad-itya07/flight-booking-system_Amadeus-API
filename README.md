# Let's Go To Makkah - Flight Booking Application

Let's Go To Makkah is a modern, full-stack flight booking web application built with Next.js and Express.js. It provides users with a seamless experience to search, book, and manage flight reservations with an intuitive interface and smooth animations.

**Live Demo:** [https://flight-booking-assignment.vercel.app/](https://flight-booking-assignment.vercel.app/)

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.1](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design
- **UI Components**: Custom components built with [Radix UI](https://www.radix-ui.com/) primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth interactions
- **State Management**: React Context API
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [React Day Picker](https://react-day-picker.js.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) for e-ticket downloads

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with native driver
- **Environment**: [dotenv](https://github.com/motdotla/dotenv) for configuration
- **CORS**: [cors](https://github.com/expressjs/cors) for cross-origin requests
- **Flight Data**: Integrated with [Amadeus API](https://developers.amadeus.com/) to fetch flights via city or airport name

## ✨ Features

### Core Functionality
- 🔍 **Smart Flight Search**: Search flights between cities or airports using the Amadeus API
- 📅 **Date Picker**: Interactive calendar for journey date selection
- 💺 **Flight Booking**: Complete booking flow with passenger details
- 💰 **Wallet System**: Integrated wallet for seamless payments
- 🎫 **E-Tickets**: Generate and download PDF tickets
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 📈 **Dynamic Flight Pricing**: Flight price increases by 10% if a user clicks the same flight **three times within a 10-minute window**

### User Experience
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- ⚡ **Fast Loading**: Optimized performance with Next.js
- 🔄 **Real-time Updates**: Dynamic content updates without page refresh
- 📊 **Booking Management**: View and manage all bookings in one place
- 🎯 **Smart Filtering**: Filter flights by price, airline, and departure time
- 📈 **Sort Options**: Sort by price, duration, and departure time

### Additional Features
- 🎭 **Loading States**: Elegant loading animations and skeletons
- 🎪 **Micro-interactions**: Delightful hover effects and transitions
- 📋 **Form Validation**: Client-side validation for better UX
- 🎨 **Theme Consistency**: Consistent design system throughout
- 📱 **Mobile-First**: Responsive design starting from mobile

## 🏗️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server setup
│   │   └── data-input.js      # Database seeding script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   │   ├── page.jsx       # Home page
│   │   │   ├── search/        # Flight search results
│   │   │   ├── booking/       # Booking flow pages
│   │   │   └── bookings/      # User bookings management
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── flight-card.jsx
│   │   │   ├── search-form.jsx
│   │   │   ├── header.jsx
│   │   │   └── footer.jsx
│   │   ├── context/          # React Context providers
│   │   ├── lib/              # Utility functions and data
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── next.config.mjs
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 11_Lets-Go-To-Makkah
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_STRING=your_mongodb_connection_string" > .env
   echo "PORT=5000" >> .env
   echo "FRONTEND_URL=http://localhost:3000" >> .env
   
   # Seed the database (optional)
   node src/data-input.js
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file for API keys (optional)
   echo "NEXT_PUBLIC_CLIENT_ID=your_amadeus_client_id" > .env.local
   echo "NEXT_PUBLIC_CLIENT_SECRET=your_amadeus_client_secret" >> .env.local
   echo "NEXT_PUBLIC_TOKEN_STORAGE_KEY=amadeus_token" >> .env.local
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_STRING=mongodb://localhost:27017/flightDB
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLIENT_ID=your_amadeus_api_client_id
NEXT_PUBLIC_CLIENT_SECRET=your_amadeus_api_client_secret
NEXT_PUBLIC_TOKEN_STORAGE_KEY=amadeus_token
```

## 🛠️ Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run build` - Install dependencies

## 📊 API Endpoints

### Flights
- `GET /api/flights` - Get random sample of flights
- `GET /health` - Health check endpoint

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Blue primary (#2563EB), with gray neutrals
- **Typography**: Inter font family for clean readability
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable components built with Radix UI primitives
- **Animations**: Smooth transitions powered by Framer Motion

## 🔧 Key Components

- **SearchForm** - Flight search interface
- **FlightCard** - Individual flight display
- **WalletCard** - Wallet balance display
- **FlightProvider** - Global state management
- **Button** - Customizable button component

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create new project on Railway or Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern travel booking platforms
- UI components built with Radix UI primitives
- Icons provided by Lucide React
- Animations powered by Framer Motion

---

**Built with ❤️ using Next.js and Express.js**