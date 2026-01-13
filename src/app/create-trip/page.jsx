import CreateTripPage from '@/components/create-trip/create-trip'
import React from 'react'

export const metadata = {
  title: "Create Your Trip | TripGen AI",
  description: "Craft your perfect itinerary in seconds.",
};

const page = () => {
  return (
    <div>
      <CreateTripPage />
    </div>
  )
}

export default page
