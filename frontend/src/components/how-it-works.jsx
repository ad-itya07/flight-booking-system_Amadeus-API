import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, CreditCard, Ticket } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "Search",
      description:
        "Enter your travel details to find the best flights available.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      title: "Select",
      description:
        "Choose the flight that best suits your schedule and budget.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-blue-600" />,
      title: "Book",
      description: "Enter passenger details and pay securely from your wallet.",
    },
    {
      icon: <Ticket className="h-10 w-10 text-blue-600" />,
      title: "Travel",
      description: "Receive your e-ticket and you're ready to fly!",
    },
  ];

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Booking your flight with SkyJourney is quick and easy. Follow these
          simple steps to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="border-none shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 bg-white rounded-xl"
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
