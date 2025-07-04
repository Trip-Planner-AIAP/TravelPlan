export interface ActivitySuggestion {
  title: string;
  description: string;
  type: 'attraction' | 'meal' | 'hotel' | 'transport' | 'flight';
  estimatedCost: number;
  durationMinutes: number;
  icon: string;
}

export const activitySuggestions: Record<string, ActivitySuggestion[]> = {
  attraction: [
    {
      title: 'Visit Local Museum',
      description: 'Explore the history and culture',
      type: 'attraction',
      estimatedCost: 15,
      durationMinutes: 180,
      icon: '🏛️'
    },
    {
      title: 'City Walking Tour',
      description: 'Guided tour of historic districts',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 120,
      icon: '🚶'
    },
    {
      title: 'Scenic Viewpoint',
      description: 'Panoramic city or nature views',
      type: 'attraction',
      estimatedCost: 0,
      durationMinutes: 90,
      icon: '🏔️'
    },
    {
      title: 'Local Market Visit',
      description: 'Browse traditional markets',
      type: 'attraction',
      estimatedCost: 10,
      durationMinutes: 120,
      icon: '🏪'
    },
    {
      title: 'Art Gallery',
      description: 'Contemporary and classic art',
      type: 'attraction',
      estimatedCost: 12,
      durationMinutes: 150,
      icon: '🎨'
    },
    {
      title: 'Temple/Church Visit',
      description: 'Historic religious site',
      type: 'attraction',
      estimatedCost: 0,
      durationMinutes: 90,
      icon: '⛩️'
    }
  ],
  meal: [
    {
      title: 'Local Restaurant',
      description: 'Traditional cuisine experience',
      type: 'meal',
      estimatedCost: 35,
      durationMinutes: 90,
      icon: '🍽️'
    },
    {
      title: 'Street Food Tour',
      description: 'Sample local street vendors',
      type: 'meal',
      estimatedCost: 20,
      durationMinutes: 120,
      icon: '🌮'
    },
    {
      title: 'Fine Dining',
      description: 'Upscale restaurant experience',
      type: 'meal',
      estimatedCost: 85,
      durationMinutes: 150,
      icon: '🥂'
    },
    {
      title: 'Breakfast Café',
      description: 'Local coffee and pastries',
      type: 'meal',
      estimatedCost: 12,
      durationMinutes: 60,
      icon: '☕'
    },
    {
      title: 'Food Market',
      description: 'Fresh local ingredients',
      type: 'meal',
      estimatedCost: 25,
      durationMinutes: 90,
      icon: '🥘'
    },
    {
      title: 'Cooking Class',
      description: 'Learn to cook local dishes',
      type: 'meal',
      estimatedCost: 65,
      durationMinutes: 180,
      icon: '👨‍🍳'
    }
  ],
  hotel: [
    {
      title: 'Hotel Check-in',
      description: 'Arrive and settle in',
      type: 'hotel',
      estimatedCost: 120,
      durationMinutes: 60,
      icon: '🏨'
    },
    {
      title: 'Hotel Check-out',
      description: 'Departure and luggage',
      type: 'hotel',
      estimatedCost: 0,
      durationMinutes: 30,
      icon: '🧳'
    },
    {
      title: 'Hotel Spa',
      description: 'Relaxation and wellness',
      type: 'hotel',
      estimatedCost: 80,
      durationMinutes: 120,
      icon: '🧖‍♀️'
    },
    {
      title: 'Room Service',
      description: 'In-room dining',
      type: 'hotel',
      estimatedCost: 45,
      durationMinutes: 60,
      icon: '🛎️'
    }
  ],
  transport: [
    {
      title: 'Taxi Ride',
      description: 'Door-to-door transport',
      type: 'transport',
      estimatedCost: 25,
      durationMinutes: 30,
      icon: '🚕'
    },
    {
      title: 'Public Transit',
      description: 'Bus, train, or metro',
      type: 'transport',
      estimatedCost: 5,
      durationMinutes: 45,
      icon: '🚇'
    },
    {
      title: 'Car Rental',
      description: 'Self-drive exploration',
      type: 'transport',
      estimatedCost: 60,
      durationMinutes: 480,
      icon: '🚗'
    },
    {
      title: 'Bike Rental',
      description: 'Eco-friendly city tour',
      type: 'transport',
      estimatedCost: 15,
      durationMinutes: 240,
      icon: '🚲'
    },
    {
      title: 'Airport Transfer',
      description: 'To/from airport',
      type: 'transport',
      estimatedCost: 40,
      durationMinutes: 60,
      icon: '🚌'
    }
  ],
  flight: [
    {
      title: 'Domestic Flight',
      description: 'Internal country travel',
      type: 'flight',
      estimatedCost: 150,
      durationMinutes: 120,
      icon: '✈️'
    },
    {
      title: 'International Arrival',
      description: 'Landing and customs',
      type: 'flight',
      estimatedCost: 450,
      durationMinutes: 180,
      icon: '🛬'
    },
    {
      title: 'International Departure',
      description: 'Check-in and departure',
      type: 'flight',
      estimatedCost: 0,
      durationMinutes: 180,
      icon: '🛫'
    }
  ]
};