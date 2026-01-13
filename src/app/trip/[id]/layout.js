export async function generateMetadata({ params }) {
  return {
    title: `Your Itinerary | TripGen AI`,
    description: "Explore your custom-crafted travel plan.",
  };
}

export default function TripLayout({ children }) {
  return <>{children}</>;
}
