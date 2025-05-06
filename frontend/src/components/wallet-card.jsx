"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFlights } from "@/context/flight-context"

export function WalletCard() {
  const { wallet } = useFlights()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">My Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-3xl font-bold text-blue-600">₹{wallet.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
