
// NomNom v1.1 Homepage Upgrade
// - Adds color styling
// - Adds 4 featured reviewers with star ratings
// - Adds a footer with the tagline

import React from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Star } from 'lucide-react';

const featuredReviewers = [
  {
    name: 'Koumi Mahzabin',
    review: 'Amazing food and ambiance. Hidden gem!',
    rating: 4,
  },
  {
    name: 'Al Mamun',
    review: 'Tried their beef nihari — no need to go to Karachi!',
    rating: 5,
  },
  {
    name: 'Sarah Habib',
    review: 'Family-friendly place with a clean interior.',
    rating: 4,
  },
  {
    name: 'Palash Hossain',
    review: 'Service can be slow, but food is top notch.',
    rating: 3,
  },
];

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-500' : 'text-gray-300'}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))}
  </div>
);

export default function NomNomApp() {
  return (
    <div className="bg-orange-50 min-h-screen text-gray-800">
      <header className="bg-orange-200 p-6 text-center shadow">
        <h1 className="text-3xl font-bold">🍽️ Welcome to NomNom</h1>
        <p className="text-md mt-2">Discover Dhaka's true culinary gems</p>
      </header>

      <main className="p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredReviewers.map((reviewer, idx) => (
          <Card key={idx} className="bg-white shadow-md hover:shadow-lg transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">{reviewer.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{reviewer.review}</p>
              <div className="mt-2">
                <StarRating rating={reviewer.rating} />
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <footer className="bg-orange-100 text-center p-4 text-sm text-gray-700">
        Made in the NomNom kitchen 🍜
      </footer>
    </div>
  );
}
