export interface ActivitySuggestion {
  title: string;
  description: string;
  type: 'attraction' | 'meal' | 'hotel' | 'transport' | 'flight';
  estimatedCost: number;
  durationMinutes: number;
  icon: string;
  region?: string[];
}

export const activitySuggestions: Record<string, ActivitySuggestion[]> = {
  attraction: [
    // Universal Attractions
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
    },
    {
      title: 'Botanical Garden',
      description: 'Beautiful flora and peaceful walks',
      type: 'attraction',
      estimatedCost: 8,
      durationMinutes: 120,
      icon: '🌺'
    },
    {
      title: 'Observatory/Planetarium',
      description: 'Stargazing and astronomy exhibits',
      type: 'attraction',
      estimatedCost: 18,
      durationMinutes: 150,
      icon: '🔭'
    },
    {
      title: 'Historic Castle/Fort',
      description: 'Medieval architecture and history',
      type: 'attraction',
      estimatedCost: 20,
      durationMinutes: 180,
      icon: '🏰'
    },
    {
      title: 'Zoo/Wildlife Park',
      description: 'Native and exotic animals',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 240,
      icon: '🦁'
    },
    {
      title: 'Aquarium',
      description: 'Marine life and underwater exhibits',
      type: 'attraction',
      estimatedCost: 22,
      durationMinutes: 180,
      icon: '🐠'
    },
    {
      title: 'Cultural Performance',
      description: 'Traditional music and dance show',
      type: 'attraction',
      estimatedCost: 35,
      durationMinutes: 120,
      icon: '🎭'
    },
    {
      title: 'Rooftop Bar/Observation Deck',
      description: 'City skyline views with drinks',
      type: 'attraction',
      estimatedCost: 30,
      durationMinutes: 120,
      icon: '🌆'
    },
    {
      title: 'Local Festival/Event',
      description: 'Seasonal celebrations and events',
      type: 'attraction',
      estimatedCost: 15,
      durationMinutes: 180,
      icon: '🎪'
    },
    {
      title: 'Guided Food Tour',
      description: 'Taste local specialties with guide',
      type: 'attraction',
      estimatedCost: 45,
      durationMinutes: 180,
      icon: '🍽️'
    },
    {
      title: 'Photography Workshop',
      description: 'Learn to capture the city beautifully',
      type: 'attraction',
      estimatedCost: 40,
      durationMinutes: 240,
      icon: '📸'
    },
    {
      title: 'Vintage Market/Antiques',
      description: 'Hunt for unique treasures and souvenirs',
      type: 'attraction',
      estimatedCost: 20,
      durationMinutes: 150,
      icon: '🛍️'
    },
    {
      title: 'Local Brewery/Winery Tour',
      description: 'Taste regional beverages and learn production',
      type: 'attraction',
      estimatedCost: 35,
      durationMinutes: 180,
      icon: '🍺'
    },
    {
      title: 'Escape Room Experience',
      description: 'Team puzzle-solving adventure',
      type: 'attraction',
      estimatedCost: 28,
      durationMinutes: 90,
      icon: '🔐'
    },
    {
      title: 'Spa/Wellness Center',
      description: 'Relaxation and traditional treatments',
      type: 'attraction',
      estimatedCost: 60,
      durationMinutes: 180,
      icon: '🧘'
    },

    // Asia-specific attractions
    {
      title: 'Traditional Tea Ceremony',
      description: 'Experience authentic tea culture',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 90,
      icon: '🍵',
      region: ['japan', 'china', 'korea', 'asia']
    },
    {
      title: 'Bamboo Forest Walk',
      description: 'Serene paths through towering bamboo',
      type: 'attraction',
      estimatedCost: 5,
      durationMinutes: 120,
      icon: '🎋',
      region: ['japan', 'china', 'asia']
    },
    {
      title: 'Floating Market Tour',
      description: 'Traditional water-based marketplace',
      type: 'attraction',
      estimatedCost: 20,
      durationMinutes: 180,
      icon: '🛶',
      region: ['thailand', 'vietnam', 'asia']
    },
    {
      title: 'Monkey Forest Sanctuary',
      description: 'Sacred forest with playful primates',
      type: 'attraction',
      estimatedCost: 8,
      durationMinutes: 120,
      icon: '🐒',
      region: ['bali', 'indonesia', 'asia']
    },
    {
      title: 'Rice Terrace Hiking',
      description: 'Stunning agricultural landscapes',
      type: 'attraction',
      estimatedCost: 15,
      durationMinutes: 240,
      icon: '🌾',
      region: ['bali', 'vietnam', 'philippines', 'asia']
    },
    {
      title: 'Karaoke Experience',
      description: 'Private room singing with friends',
      type: 'attraction',
      estimatedCost: 30,
      durationMinutes: 120,
      icon: '🎤',
      region: ['japan', 'korea', 'asia']
    },
    {
      title: 'Traditional Massage',
      description: 'Authentic local healing techniques',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 90,
      icon: '💆',
      region: ['thailand', 'bali', 'asia']
    },
    {
      title: 'Martial Arts Demonstration',
      description: 'Watch or learn traditional fighting arts',
      type: 'attraction',
      estimatedCost: 20,
      durationMinutes: 120,
      icon: '🥋',
      region: ['china', 'japan', 'korea', 'asia']
    },

    // Europe-specific attractions
    {
      title: 'Cathedral/Gothic Architecture',
      description: 'Magnificent medieval religious buildings',
      type: 'attraction',
      estimatedCost: 10,
      durationMinutes: 120,
      icon: '⛪',
      region: ['france', 'spain', 'italy', 'germany', 'europe']
    },
    {
      title: 'Wine Tasting in Vineyard',
      description: 'Sample regional wines in scenic setting',
      type: 'attraction',
      estimatedCost: 45,
      durationMinutes: 180,
      icon: '🍷',
      region: ['france', 'italy', 'spain', 'europe']
    },
    {
      title: 'Royal Palace Tour',
      description: 'Opulent rooms and royal history',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 180,
      icon: '👑',
      region: ['france', 'spain', 'england', 'europe']
    },
    {
      title: 'Christmas Market',
      description: 'Festive stalls with crafts and treats',
      type: 'attraction',
      estimatedCost: 15,
      durationMinutes: 120,
      icon: '🎄',
      region: ['germany', 'austria', 'europe']
    },
    {
      title: 'Flamenco Show',
      description: 'Passionate Spanish dance performance',
      type: 'attraction',
      estimatedCost: 40,
      durationMinutes: 120,
      icon: '💃',
      region: ['spain', 'europe']
    },
    {
      title: 'Gondola Ride',
      description: 'Romantic canal journey',
      type: 'attraction',
      estimatedCost: 80,
      durationMinutes: 60,
      icon: '🚣',
      region: ['italy', 'venice', 'europe']
    },
    {
      title: 'Opera House Performance',
      description: 'World-class musical performances',
      type: 'attraction',
      estimatedCost: 60,
      durationMinutes: 180,
      icon: '🎭',
      region: ['italy', 'austria', 'france', 'europe']
    },
    {
      title: 'Medieval Town Walk',
      description: 'Cobblestone streets and ancient walls',
      type: 'attraction',
      estimatedCost: 12,
      durationMinutes: 150,
      icon: '🏘️',
      region: ['germany', 'france', 'italy', 'europe']
    },

    // Americas-specific attractions
    {
      title: 'National Park Hiking',
      description: 'Pristine wilderness and wildlife',
      type: 'attraction',
      estimatedCost: 15,
      durationMinutes: 300,
      icon: '🏞️',
      region: ['usa', 'canada', 'americas']
    },
    {
      title: 'Broadway Show',
      description: 'World-famous theater productions',
      type: 'attraction',
      estimatedCost: 120,
      durationMinutes: 180,
      icon: '🎭',
      region: ['usa', 'new york', 'americas']
    },
    {
      title: 'Baseball Game',
      description: 'Classic American pastime experience',
      type: 'attraction',
      estimatedCost: 45,
      durationMinutes: 240,
      icon: '⚾',
      region: ['usa', 'americas']
    },
    {
      title: 'Rodeo Show',
      description: 'Cowboys and traditional western culture',
      type: 'attraction',
      estimatedCost: 35,
      durationMinutes: 180,
      icon: '🤠',
      region: ['usa', 'texas', 'americas']
    },
    {
      title: 'Jazz Club Experience',
      description: 'Live music in intimate setting',
      type: 'attraction',
      estimatedCost: 25,
      durationMinutes: 150,
      icon: '🎷',
      region: ['usa', 'new orleans', 'americas']
    },

    // Africa-specific attractions
    {
      title: 'Safari Game Drive',
      description: 'Wildlife viewing in natural habitat',
      type: 'attraction',
      estimatedCost: 150,
      durationMinutes: 360,
      icon: '🦁',
      region: ['africa', 'kenya', 'tanzania', 'south africa']
    },
    {
      title: 'Traditional Village Visit',
      description: 'Experience local tribal culture',
      type: 'attraction',
      estimatedCost: 30,
      durationMinutes: 180,
      icon: '🏘️',
      region: ['africa']
    },
    {
      title: 'Desert Camel Trek',
      description: 'Journey across sand dunes',
      type: 'attraction',
      estimatedCost: 80,
      durationMinutes: 240,
      icon: '🐪',
      region: ['africa', 'morocco', 'egypt']
    },

    // Oceania-specific attractions
    {
      title: 'Great Barrier Reef Snorkeling',
      description: 'Underwater coral paradise',
      type: 'attraction',
      estimatedCost: 85,
      durationMinutes: 240,
      icon: '🐠',
      region: ['australia', 'oceania']
    },
    {
      title: 'Aboriginal Cultural Experience',
      description: 'Ancient traditions and dreamtime stories',
      type: 'attraction',
      estimatedCost: 40,
      durationMinutes: 180,
      icon: '🪃',
      region: ['australia', 'oceania']
    },
    {
      title: 'Fjord Cruise',
      description: 'Dramatic coastal landscapes',
      type: 'attraction',
      estimatedCost: 60,
      durationMinutes: 240,
      icon: '🚢',
      region: ['new zealand', 'oceania']
    }
  ],
  meal: [
    // Universal meals
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
    },
    {
      title: 'Rooftop Restaurant',
      description: 'Dining with panoramic views',
      type: 'meal',
      estimatedCost: 55,
      durationMinutes: 120,
      icon: '🌃'
    },
    {
      title: 'Food Truck Experience',
      description: 'Casual gourmet on wheels',
      type: 'meal',
      estimatedCost: 15,
      durationMinutes: 45,
      icon: '🚚'
    },
    {
      title: 'Picnic in Park',
      description: 'Outdoor dining with local treats',
      type: 'meal',
      estimatedCost: 18,
      durationMinutes: 90,
      icon: '🧺'
    },
    {
      title: 'Wine & Cheese Tasting',
      description: 'Regional pairings and flavors',
      type: 'meal',
      estimatedCost: 40,
      durationMinutes: 120,
      icon: '🧀'
    },

    // Asia-specific meals
    {
      title: 'Sushi Omakase',
      description: 'Chef\'s choice premium sushi experience',
      type: 'meal',
      estimatedCost: 120,
      durationMinutes: 120,
      icon: '🍣',
      region: ['japan', 'asia']
    },
    {
      title: 'Ramen Shop',
      description: 'Authentic noodle soup experience',
      type: 'meal',
      estimatedCost: 18,
      durationMinutes: 45,
      icon: '🍜',
      region: ['japan', 'asia']
    },
    {
      title: 'Hot Pot Dinner',
      description: 'Communal cooking and dining',
      type: 'meal',
      estimatedCost: 35,
      durationMinutes: 120,
      icon: '🍲',
      region: ['china', 'asia']
    },
    {
      title: 'Dim Sum Brunch',
      description: 'Small plates and tea service',
      type: 'meal',
      estimatedCost: 28,
      durationMinutes: 90,
      icon: '🥟',
      region: ['china', 'hong kong', 'asia']
    },
    {
      title: 'Korean BBQ',
      description: 'Grilled meat at your table',
      type: 'meal',
      estimatedCost: 45,
      durationMinutes: 120,
      icon: '🥩',
      region: ['korea', 'asia']
    },
    {
      title: 'Thai Street Food',
      description: 'Spicy and flavorful local dishes',
      type: 'meal',
      estimatedCost: 12,
      durationMinutes: 60,
      icon: '🌶️',
      region: ['thailand', 'asia']
    },
    {
      title: 'Balinese Feast',
      description: 'Traditional Indonesian banquet',
      type: 'meal',
      estimatedCost: 25,
      durationMinutes: 90,
      icon: '🥥',
      region: ['bali', 'indonesia', 'asia']
    },

    // Europe-specific meals
    {
      title: 'French Bistro',
      description: 'Classic Parisian dining experience',
      type: 'meal',
      estimatedCost: 65,
      durationMinutes: 120,
      icon: '🥖',
      region: ['france', 'europe']
    },
    {
      title: 'Italian Trattoria',
      description: 'Family-style pasta and wine',
      type: 'meal',
      estimatedCost: 45,
      durationMinutes: 120,
      icon: '🍝',
      region: ['italy', 'europe']
    },
    {
      title: 'Spanish Tapas Bar',
      description: 'Small plates and sangria',
      type: 'meal',
      estimatedCost: 35,
      durationMinutes: 120,
      icon: '🍤',
      region: ['spain', 'europe']
    },
    {
      title: 'German Beer Garden',
      description: 'Sausages, pretzels, and local beer',
      type: 'meal',
      estimatedCost: 30,
      durationMinutes: 120,
      icon: '🍺',
      region: ['germany', 'europe']
    },
    {
      title: 'English Pub Lunch',
      description: 'Fish & chips with ale',
      type: 'meal',
      estimatedCost: 25,
      durationMinutes: 90,
      icon: '🍻',
      region: ['england', 'uk', 'europe']
    },
    {
      title: 'Greek Taverna',
      description: 'Mediterranean seafood and mezze',
      type: 'meal',
      estimatedCost: 40,
      durationMinutes: 120,
      icon: '🐟',
      region: ['greece', 'europe']
    },

    // Americas-specific meals
    {
      title: 'BBQ Smokehouse',
      description: 'Slow-cooked meats and sides',
      type: 'meal',
      estimatedCost: 35,
      durationMinutes: 90,
      icon: '🍖',
      region: ['usa', 'americas']
    },
    {
      title: 'Mexican Cantina',
      description: 'Tacos, margaritas, and live music',
      type: 'meal',
      estimatedCost: 28,
      durationMinutes: 90,
      icon: '🌮',
      region: ['mexico', 'usa', 'americas']
    },
    {
      title: 'Diner Experience',
      description: 'Classic American comfort food',
      type: 'meal',
      estimatedCost: 20,
      durationMinutes: 75,
      icon: '🥞',
      region: ['usa', 'americas']
    },
    {
      title: 'Steakhouse Dinner',
      description: 'Premium cuts and wine pairings',
      type: 'meal',
      estimatedCost: 95,
      durationMinutes: 150,
      icon: '🥩',
      region: ['usa', 'argentina', 'americas']
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
    },
    {
      title: 'Hotel Pool & Gym',
      description: 'Fitness and swimming facilities',
      type: 'hotel',
      estimatedCost: 0,
      durationMinutes: 90,
      icon: '🏊'
    },
    {
      title: 'Concierge Services',
      description: 'Local recommendations and bookings',
      type: 'hotel',
      estimatedCost: 10,
      durationMinutes: 30,
      icon: '🎩'
    },
    {
      title: 'Hotel Restaurant',
      description: 'On-site dining experience',
      type: 'hotel',
      estimatedCost: 55,
      durationMinutes: 90,
      icon: '🍽️'
    },
    {
      title: 'Business Center',
      description: 'Work facilities and internet',
      type: 'hotel',
      estimatedCost: 15,
      durationMinutes: 120,
      icon: '💼'
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
    },
    {
      title: 'Ride Share',
      description: 'App-based transportation',
      type: 'transport',
      estimatedCost: 18,
      durationMinutes: 25,
      icon: '📱'
    },
    {
      title: 'Scooter Rental',
      description: 'Quick city navigation',
      type: 'transport',
      estimatedCost: 25,
      durationMinutes: 180,
      icon: '🛵'
    },
    {
      title: 'Ferry Ride',
      description: 'Scenic water transportation',
      type: 'transport',
      estimatedCost: 12,
      durationMinutes: 45,
      icon: '⛴️'
    },
    {
      title: 'Private Driver',
      description: 'Chauffeur service for the day',
      type: 'transport',
      estimatedCost: 150,
      durationMinutes: 480,
      icon: '🚙'
    },
    {
      title: 'Walking Tour',
      description: 'Explore on foot with guide',
      type: 'transport',
      estimatedCost: 20,
      durationMinutes: 120,
      icon: '🚶‍♂️'
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
    },
    {
      title: 'Connecting Flight',
      description: 'Transfer between flights',
      type: 'flight',
      estimatedCost: 0,
      durationMinutes: 90,
      icon: '🔄'
    },
    {
      title: 'Private Jet Charter',
      description: 'Luxury air travel',
      type: 'flight',
      estimatedCost: 2500,
      durationMinutes: 180,
      icon: '🛩️'
    },
    {
      title: 'Helicopter Tour',
      description: 'Scenic aerial sightseeing',
      type: 'flight',
      estimatedCost: 200,
      durationMinutes: 60,
      icon: '🚁'
    }
  ]
};

// Helper function to get region-specific suggestions
export const getRegionSpecificSuggestions = (category: string, destination: string): ActivitySuggestion[] => {
  const allSuggestions = activitySuggestions[category] || [];
  const destinationLower = destination.toLowerCase();
  
  // Filter suggestions based on region
  const regionSpecific = allSuggestions.filter(suggestion => {
    if (!suggestion.region) return true; // Include universal suggestions
    
    return suggestion.region.some(region => 
      destinationLower.includes(region.toLowerCase())
    );
  });
  
  // If we have region-specific suggestions, prioritize them
  if (regionSpecific.length > 0) {
    return regionSpecific;
  }
  
  // Fallback to all suggestions if no region match
  return allSuggestions;
};